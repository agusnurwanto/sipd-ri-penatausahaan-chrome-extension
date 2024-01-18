window._interval = false;

jQuery('body').on('click', '.listen-me', function(){
	var time = new Date();
	time = Math.ceil((time.getTime()+5000000)/1000);
	var key_ri = x_api_key2({
		time: time,
		show: true
	});
	if(config.private){
		var data_ri = { 
			action: 'singkron_token_ri',
			api_key: config.api_key,
			token: _token.token,
			key: key_ri,
			tahun: _token.tahun,
			id_daerah: _token.daerah_id,
			user_agent: window.navigator.userAgent
		};
		var data = {
			message:{
				type: "get-url",
				content: {
					url: config.url_server_lokal,
					type: 'post',
					data: data_ri,
					return: false
				}
			}
		};
		chrome.runtime.sendMessage(data, function(response) {
			console.log('kirim token ke lokal', response);
		});
	}
});

let previousUrl = "";
const observer = new MutationObserver(() => {
  	if (window.location.href !== previousUrl) {
	    console.log(`URL changed from ${previousUrl} to ${window.location.href}`);
	    previousUrl = window.location.href;
	    cekUrl(previousUrl);
  	}
});

observer.observe(document, { subtree: true, childList: true });

function cekUrl(current_url, nomor=1){
	if(nomor > 1){
		console.log('Run ulang cekUrl() ke '+nomor+' URL: '+current_url);
	}else{
		cekLisensi();
		run_script('cek_extension', 'image');
	}

	getToken();

	// untuk menjaga session
	clearInterval(_interval);
	intervalSession();
	
	var loading = ''
		+'<div id="wrap-loading">'
	        +'<div class="lds-hourglass"></div>'
	        +'<div id="persen-loading"></div>'
	        +'<div id="pesan-loading"></div>'
	    +'</div>';
	if(jQuery('#wrap-loading').length == 0){
		jQuery('body').prepend(loading);
	}

	jQuery('.aksi-extension').remove();
	jQuery('#modal-extension').remove();

	setTimeout(function(){
		var img_logo = jQuery('.d-flex.align-items-stretch.flex-shrink-0 img').eq(0);
		if(!img_logo.hasClass('listen-me')){
			img_logo.addClass('listen-me');
		}

		var cek_reload = true;
		var title_admin = jQuery('#ZEUS main header .items-center.h-full');
		// jika halaman admin
		if(title_admin.length >= 1){
			var aksi_admin = ''
				+'<div id="aksi-admin" class="menu-item me-lg-1">'
					// +'<a class="btn btn-success btn-sm" onclick="ganti_tahun();" style="margin-left: 2px;">Ganti Tahun Anggaran</a>'
					// +'<a class="btn btn-danger btn-sm" onclick="logout();" style="margin-left: 5px;">Keluar</a>'
				+'</div>'
			if(jQuery('#aksi-admin').length == 0){
				title_admin.find('> .items-center').eq(0).after(aksi_admin);
			}
			cek_reload = false;

			// Data RAK SIPD
			if(current_url.indexOf('penatausahaan/pengeluaran/dpa/rencana-penarikan-dana/belanja') != -1)
			{
				var title = jQuery('.card-title.custom-class').text();
				console.log('Halaman RAK Belanja', title);
				jQuery('.aksi-extension').remove();
				var btn = ''
					+'<div class="aksi-extension" style="display: inline-block;">'						
						+'<button style="margin-left: 20px;" class="btn btn-sm btn-danger" id="singkron_rak_sipd_lokal">Singkron RAK Sub Kegiatan ke DB Lokal</button>'					
					+'</div>';
				jQuery('.card-title.custom-class').append(btn);
				if(title.indexOf(' | Detail Belanja') != -1){
					jQuery('#singkron_rak_sipd_lokal').on('click', function(){
						if(confirm('Apakah anda yakin melakukan backup data anggaran kas? Data lokal akan diupdate sesuai data terbaru.')){
							jQuery('#wrap-loading').show();
							var sub = current_url.split('/');
							get_rak({
								id_unit: sub[9],
								id_skpd: sub[10],
								id_sub_skpd: sub[11],
								id_urusan: sub[12],
								id_bidang_urusan: sub[13],
								id_program: sub[14],
								id_giat: sub[15],
								id_sub_giat: sub[16]
							}, function(){
								alert('Berhasil singkron RAK ke lokal!');
								jQuery('#wrap-loading').hide();
							});
						}
					});
				}else if(title.indexOf(' | Sub Belanja') != -1){
					jQuery('#singkron_rak_sipd_lokal').text('Singkron RAK SKPD ke DB Lokal');
					jQuery('#singkron_rak_sipd_lokal').on('click', function(){
						if(confirm('Apakah anda yakin melakukan backup data anggaran kas? Data lokal akan diupdate sesuai data terbaru.')){
							jQuery('#wrap-loading').show();
							var sub = current_url.split('/');
							get_sub_keg(sub[9], function(){
								alert('Berhasil singkron RAK ke lokal!');
								jQuery('#wrap-loading').hide();
	            			});
						}
					});
				}else if(title.indexOf(' | Belanja') != -1){
					jQuery('#singkron_rak_sipd_lokal').text('Singkron ALL SKPD ke DB Lokal');
					jQuery('#singkron_rak_sipd_lokal').on('click', function(){
						if(confirm('Apakah anda yakin melakukan backup data anggaran kas? Data lokal akan diupdate sesuai data terbaru.')){
							singkron_rak_ke_lokal();
						}
					});
				}else{
					jQuery('.aksi-extension').remove();
				}
				
			// Data Master Pegawai dan user
			}else if(
				current_url.indexOf('penatausahaan/setting/pegawai') != -1
				|| current_url.indexOf('penatausahaan/user') != -1
			){
				var title = jQuery('.card-title.custom-class').text();
				console.log('halaman Pegawai', title);
				if(title == ''){
					console.log('konten halaman belum terload!');
					cek_reload = true;
				}
				jQuery('.aksi-extension').remove();
				var btn = ''
					+'<div class="aksi-extension card-header-slot">'						
						+'<button style="margin-left: 20px;" class="btn btn-sm btn-danger" id="singkron_pegawai_lokal">Singkron Pegawai ke DB Lokal</button>'
						+'<button style="margin-left: 20px;" class="btn btn-sm btn-danger" id="singkron_panggol_lokal">Master Pangkat Golongan ke DB Lokal</button>'
					+'</div>';
				jQuery('.card-header-slot').before(btn);
				jQuery('#singkron_pegawai_lokal').on('click', function(){
					if(confirm('Apakah anda yakin melakukan backup data pegawai? Data lokal akan diupdate sesuai data terbaru.')){
						singkron_pegawai_lokal();						
					}
				});
				jQuery('#singkron_panggol_lokal').on('click', function(){
					if(confirm('Apakah anda yakin melakukan backup data pegawai? Data lokal akan diupdate sesuai data terbaru.')){
						singkron_panggol_lokal();						
					}
				});
			}
		// jika halaman login
		}else if(
			current_url.indexOf('/landing-page') != -1
			|| current_url.indexOf('/tahun/list') != -1
		){
			cek_reload = false;
		}else if(current_url.indexOf('/penatausahaan/login') != -1){
			var lihat_pass = ''
				+'<label style="margin-top: 35px; margin-bottom: 10px;"><input type="checkbox" onclick="lihat_password(this)"> Lihat Password</label>';
				// +'<a class="btn btn-lg btn-warning w-100" onclick="login_sipd()" id="login-ext">Login Chrome Extension</a>';
			var password = jQuery('input[name="password"]');
			if(
				password.length >= 1
				&& jQuery('#login-ext').length < 1
			){
				password.after(lihat_pass);
				cek_reload = false;
				jQuery('#prov-autocomplete').after('<span style="color: red; font-weight: bold" id="id_prov"></span>')
				jQuery('#prov-autocomplete').on('change paste keyup', function(){
					var prov = jQuery(this).val();
					console.log('get_prov_login', prov);
					if(prov == ''){
						return;
					}
					get_prov_login()
					.then(function(prov_all){
						prov_all.map(function(b, i){
							if(b.nama_daerah == prov){
								jQuery('#id_prov').html('id_prov = '+b.id_daerah+' | kode = '+b.kode_ddn+' | '+b.nama_daerah);
								jQuery('#id_prov').attr('id_prov', b.id_daerah);
							}
						});
					});
				});
				jQuery('#kabkot-autocomplete').after('<span style="color: red; font-weight: bold" id="id_kab"></span>')
				jQuery('#kabkot-autocomplete').on('change paste keyup', function(){
					var id_prov = jQuery('#id_prov').attr('id_prov');
					var kab = jQuery(this).val();
					console.log('get_kab_login', kab, id_prov);
					if(kab == '' || typeof id_prov == 'undefined' || id_prov == ''){
						return;
					}
					get_kab_login(id_prov)
					.then(function(kab_all){
						kab_all.map(function(b, i){
							if(b.nama_daerah == kab){
								jQuery('#id_kab').html('id_kab = '+b.id_daerah+' | kode = '+b.kode_ddn+' | '+b.nama_daerah);
							}
						});
					});
				});

				var lihat_id = ''
					+'<span style="margin-top: 15px; margin-bottom: 15px;" class="btn btn-sm btn-info" id="lihat_id_daerah"> Lihat ID daerah</span>';
				jQuery('label[for="prov-autocomplete"]').before(lihat_id);
				jQuery('#lihat_id_daerah').on('click', function(){
					lihat_id_daerah();
				});
			}
		}

		// ulangi cek url
		if(cek_reload){
			current_url = window.location.href;
			cekUrl(current_url, nomor+1);
		}
	}, 1000);
}