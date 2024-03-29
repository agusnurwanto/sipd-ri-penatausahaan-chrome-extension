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
			if(current_url.indexOf('penatausahaan/pengeluaran/dpa/rencana-penarikan-dana/belanja') != -1){
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
				}else if(title.indexOf('Cetak Dokumen') != -1){
					jQuery('.container-frame-pdf').attr('contenteditable', true);
				}else{
					jQuery('.aksi-extension').remove();
				}
			}
			// DATA RAK Pembiayaan Peneluaran
			else if(current_url.indexOf('penatausahaan/penatausahaan/pengeluaran/dpa/rencana-penarikan-dana/pengeluaran-pembiayaan') != -1)
			{	
				var title = jQuery('.card-title.custom-class').text();
					console.log('Halaman RAK pembiayaan', title);
					jQuery('.aksi-extension').remove();
					var btn = ''
						+'<div class="aksi-extension" style="display: inline-block;">'						
							+'<button style="margin-left: 20px;" class="btn btn-sm btn-danger" id="singkron_rak_pembiayaan_pengeluaran_sipd_lokal">Singkron RAK Pembiayaan ke DB Lokal</button>'					
						+'</div>';
					jQuery('.card-title.custom-class').append(btn);
					if(title.indexOf(' | Pengeluaran Pembiayaan') != -1){
						jQuery('#singkron_rak_pembiayaan_pengeluaran_sipd_lokal').text('Singkron Pembiayaan Pengeluaran ke DB Lokal');
						jQuery('#singkron_rak_pembiayaan_pengeluaran_sipd_lokal').on('click', function(){
							if(confirm('Apakah anda yakin melakukan backup data anggaran kas Pembiayaan Pengeluaran? Data lokal akan diupdate sesuai data terbaru.')){
								singkron_rak_pembiayaan_pengeluaran_sipd_lokal();
							}
						});
					}else{
						jQuery('.aksi-extension').remove();
					}
			}
			// DATA RAK Pembiayaan penerimaan
			else if(current_url.indexOf('penatausahaan/penatausahaan/pengeluaran/dpa/rencana-penerimaan-dana/penerimaan-pembiayaan') != -1)
			{	
				var title = jQuery('.card-title.custom-class').text();
					console.log('Halaman RAK pembiayaan penerimaan', title);
					jQuery('.aksi-extension').remove();
					var btn = ''
						+'<div class="aksi-extension" style="display: inline-block;">'						
							+'<button style="margin-left: 20px;" class="btn btn-sm btn-danger" id="singkron_rak_pembiayaan_penerimaan_sipd_lokal">Singkron RAK Pembiayaan ke DB Lokal</button>'					
						+'</div>';
					jQuery('.card-title.custom-class').append(btn);
					if(title.indexOf(' | Penerimaan Pembiayaan') != -1){
						jQuery('#singkron_rak_pembiayaan_penerimaan_sipd_lokal').text('Singkron Pembiayaan Penerimaan ke DB Lokal');
						jQuery('#singkron_rak_pembiayaan_penerimaan_sipd_lokal').on('click', function(){
							if(confirm('Apakah anda yakin melakukan backup data anggaran kas Pembiayaan Penerimaan? Data lokal akan diupdate sesuai data terbaru.')){
								singkron_rak_pembiayaan_penerimaan_sipd_lokal();
							}
						});
					}else{
						jQuery('.aksi-extension').remove();
					}
			}
			// DATA RAK Pembiayaan penerimaan
			else if(current_url.indexOf('penatausahaan/penatausahaan/pengeluaran/dpa/rencana-penerimaan-dana/pendapatan') != -1)
			{	
				var title = jQuery('.card-title.custom-class').text();
					console.log('Halaman RAK Pendapatan', title);
					jQuery('.aksi-extension').remove();
					var btn = ''
						+'<div class="aksi-extension" style="display: inline-block;">'						
							+'<button style="margin-left: 20px;" class="btn btn-sm btn-danger" id="singkron_rak_pendapatan_sipd_lokal">Singkron RAK Pembiayaan ke DB Lokal</button>'					
						+'</div>';
					jQuery('.card-title.custom-class').append(btn);
					if(title.indexOf(' | Pendapatan') != -1){
						jQuery('#singkron_rak_pendapatan_sipd_lokal').text('Singkron ALL SKPD ke DB Lokal');
						jQuery('#singkron_rak_pendapatan_sipd_lokal').on('click', function(){
							if(confirm('Apakah anda yakin melakukan backup data anggaran kas Pendapatan? Data lokal akan diupdate sesuai data terbaru.')){
								singkron_rak_pendapatan_sipd_lokal();
							}
						});
					}else{
						jQuery('.aksi-extension').remove();
					}
			//BESARAN UP
			}
			// DATA Besaran UP
			else if(current_url.indexOf('penatausahaan/setting/besaran-up') != -1){
				var title = jQuery('.card-title.custom-class').text();
				console.log('Besaran Uang Persediaan (UP)', title);
				jQuery('.aksi-extension').remove();
				var btn = ''
					+'<div class="aksi-extension card-header-slot">'												
						+'<button style="margin-left: 20px;" class="btn btn-sm btn-danger" id="singkron_up">Singkron UP ke DB Lokal</button>'
					+'</div>';
				jQuery('.card-header-slot').before(btn);				
				jQuery('#singkron_up').on('click', function(){
					if(confirm('Apakah anda yakin melakukan backup data UP? Data lokal akan diupdate sesuai data terbaru.')){
						singkron_up();						
					}
				});
			//SPD	
			}
			// DATA Otorisasi SPD
			else if(current_url.indexOf('penatausahaan/penatausahaan/pengeluaran/spd/otorisasi') != -1	){
				var title = jQuery('.card-title.custom-class').text();
				console.log('Surat Penyediaan Dana (SPD)', title);
				jQuery('.aksi-extension').remove();
				var btn = ''
					+'<div class="aksi-extension" style="display: inline-block;">'						
						+'<button style="margin-left: 20px;" class="btn btn-sm btn-danger" id="singkron_spd_lokal">Singkron SPD ke DB Lokal</button>'					
					+'</div>';
				jQuery('.card-title.custom-class').append(btn);				
				if(
					title.indexOf('Surat Penyediaan Dana (SPD)') != -1
					|| title.indexOf(' | Otorisasi') != -1
				){
					jQuery('#singkron_spd_lokal').text('Singkron ALL SKPD ke DB Lokal');
					jQuery('#singkron_spd_lokal').on('click', function(){
						if(confirm('Apakah anda yakin melakukan backup data SPD? Data lokal akan diupdate sesuai data terbaru.')){
							singkron_spd_lokal();						
						}
					});
				}else{
					jQuery('.aksi-extension').remove();
				}				
				//SPD PA
			}
			// DATA Pengeluaran SPD
			else if(current_url.indexOf('penatausahaan/penatausahaan/pengeluaran/spd/pembuatan') != -1	){
				var title = jQuery('.card-title.custom-class').text();
				console.log('Surat Penyediaan Dana (SPD)', title);
				jQuery('.aksi-extension').remove();
				var btn = ''
					+'<div class="aksi-extension" style="display: inline-block;">'						
						+'<button style="margin-left: 20px;" class="btn btn-sm btn-danger" id="singkron_spd_pa_lokal">Singkron SPD ke DB Lokal</button>'					
					+'</div>';
				jQuery('.card-title.custom-class').append(btn);				
				if(title.indexOf('Surat Penyediaan Dana (SPD)') != -1){
					jQuery('#singkron_spd_pa_lokal').text('Singkron SPD SKPD ke DB Lokal');
					jQuery('#singkron_spd_pa_lokal').on('click', function(){
						if(confirm('Apakah anda yakin melakukan backup data SPD? Data lokal akan diupdate sesuai data terbaru.')){
							singkron_spd_pa_lokal();						
						}
					});
				}else{
					jQuery('.aksi-extension').remove();
				}	
			// SPP
			}
			// DATA Pengeluaran SPP
			else if(current_url.indexOf('penatausahaan/penatausahaan/pengeluaran/spp/pembuatan') != -1	){
				var title = jQuery('.card-title.custom-class').text();
				window.type_data = 'UP';
				if(current_url.indexOf('penatausahaan/penatausahaan/pengeluaran/spp/pembuatan?type=UP') != -1){
					type_data = 'UP';
				}else if(current_url.indexOf('penatausahaan/penatausahaan/pengeluaran/spp/pembuatan?type=GU') != -1){
					type_data = 'GU';
				}else if(current_url.indexOf('penatausahaan/penatausahaan/pengeluaran/spp/pembuatan?type=TU') != -1){
					type_data = 'TU';
				}else if(current_url.indexOf('penatausahaan/penatausahaan/pengeluaran/spp/pembuatan?type=LS') != -1){
					type_data = 'LS';
				}
				console.log('Surat Permintaan Pembayaran (SPP)', title);
				jQuery('.aksi-extension').remove();
				var btn = ''
					+'<div class="aksi-extension" style="display: inline-block;">'						
						+'<button style="margin-left: 20px;" class="btn btn-sm btn-danger" id="singkron_spp_lokal">Singkron SPP '+type_data+' ke DB Lokal</button>'					
					+'</div>';
				jQuery('.card-title.custom-class').append(btn);				
				if(title.indexOf('Surat Permintaan Pembayaran (SPP)') != -1){
					jQuery('#singkron_spp_lokal').text('Singkron SPP '+type_data+' ke DB Lokal');
					jQuery('#singkron_spp_lokal').on('click', function(){
						if(confirm('Apakah anda yakin melakukan backup data SPP '+type_data+'? Data lokal akan diupdate sesuai data terbaru.')){
							singkron_spp_lokal(type_data);
						}
					});
				}else{
					jQuery('.aksi-extension').remove();
				}
			// SPM
			}
			// DATA Pengeluaran SPM
			else if(current_url.indexOf('penatausahaan/penatausahaan/pengeluaran/spm/pembuatan') != -1	){
				var title = jQuery('.card-title.custom-class').text();
				window.type_data = ['UP', 'LS', 'GU', 'TU'];
				if(current_url.indexOf('penatausahaan/penatausahaan/pengeluaran/spm/pembuatan?type=UP') != -1){
					type_data = ['UP'];
				}else if(current_url.indexOf('penatausahaan/penatausahaan/pengeluaran/spm/pembuatan?type=GU') != -1){
					type_data = ['GU'];
				}else if(current_url.indexOf('penatausahaan/penatausahaan/pengeluaran/spm/pembuatan?type=TU') != -1){
					type_data = ['TU'];
				}else if(current_url.indexOf('penatausahaan/penatausahaan/pengeluaran/spm/pembuatan?type=LS') != -1){
					type_data = ['LS'];
				}
				console.log('Surat Perintah Membayar (SPM)', title);
				jQuery('.aksi-extension').remove();
				var btn = ''
					+'<div class="aksi-extension" style="display: inline-block;">'						
						+'<button style="margin-left: 20px;" class="btn btn-sm btn-danger" id="singkron_spm_lokal">Singkron SPM '+type_data.join(', ')+' ke DB Lokal</button>'					
					+'</div>';
				jQuery('.card-title.custom-class').append(btn);				
				if(title.indexOf('| Pembuatan') != -1){
					jQuery('#singkron_spm_lokal').text('Singkron SPM '+type_data.join(', ')+' ke DB Lokal');
					jQuery('#singkron_spm_lokal').on('click', function(){
						if(confirm('Apakah anda yakin melakukan backup data SPM '+type_data.join(', ')+'? Data lokal akan diupdate sesuai data terbaru.')){
							singkron_spm_lokal(type_data);
						}
					});
				}else{
					jQuery('.aksi-extension').remove();
				}
			// SP2D
			}
			// DATA Pengeluaran SP2D
			else if(current_url.indexOf('penatausahaan/pengeluaran/sp2d') != -1	){
				var title = jQuery('.card-title.custom-class').text();
				console.log('Surat Perintah Pencairan Dana', title);
				jQuery('.aksi-extension').remove();
				var btn = ''
					+'<div class="aksi-extension" style="display: inline-block;">'						
						+'<button style="margin-left: 20px;" class="btn btn-sm btn-danger" id="singkron_sp2d_lokal">Singkron SP2D ke DB Lokal</button>'					
					+'</div>';
				jQuery('.card-title.custom-class').append(btn);				
				if(title.indexOf('Surat Perintah Pencairan Dana |') != -1){
					jQuery('#singkron_sp2d_lokal').on('click', function(){
						if(confirm('Apakah anda yakin melakukan backup data SP2D? Data lokal akan diupdate sesuai data terbaru.')){
							// singkron_sp2d_lokal(type_data);	
							singkron_sp2d_lokal();						
						}
					});
				}else{
					jQuery('.aksi-extension').remove();
				}
			}
			// DATA Pengeluaran TBP
			else if(current_url.indexOf('penatausahaan/penatausahaan/pengeluaran/tbp/up-gu') != -1	){
				var title = jQuery('.card-title.custom-class').text();				
				console.log('Tanda Bukti Pembayaran | Uang Persediaan / Ganti Uang', title);
				jQuery('.aksi-extension').remove();
				var btn = ''
					+'<div class="aksi-extension" style="display: inline-block;">'						
						+'<button style="margin-left: 20px;" class="btn btn-sm btn-danger" id="singkron_tbp_lokal">Singkron TBP ke DB Lokal</button>'					
					+'</div>';
				jQuery('.card-title.custom-class').append(btn);				
				if(title.indexOf('Tanda Bukti Pembayaran | Uang Persediaan / Ganti Uang') != -1){
					jQuery('#singkron_tbp_lokal').text('Singkron TBP ke DB Lokal');
					jQuery('#singkron_tbp_lokal').on('click', function(){
						if(confirm('Apakah anda yakin melakukan backup data TBP ? Data lokal akan diupdate sesuai data terbaru.')){
							singkron_tbp_lokal();
						}
					});
				}else{
					jQuery('.aksi-extension').remove();
				}			
			}	
			// DATA Pertanggung Jawaban NPD
			else if(current_url.indexOf('penatausahaan/penatausahaan/pengeluaran/rekapitulasi-npd') != -1	){
				var title = jQuery('.card-title.custom-class').text();				
				console.log('Pertanggung Jawaban Nota Pencairan Dana', title);
				jQuery('.aksi-extension').remove();
				var btn = ''
					+'<div class="aksi-extension" style="display: inline-block;">'						
						+'<button style="margin-left: 20px;" class="btn btn-sm btn-danger" id="singkron_npd_lokal">Singkron NPD ke DB Lokal</button>'					
					+'</div>';
				jQuery('.card-title.custom-class').append(btn);				
				if(title.indexOf('Pertanggung Jawaban Nota Pencairan Dana') != -1){
					jQuery('#singkron_npd_lokal').text('Singkron NPD ke DB Lokal');
					jQuery('#singkron_npd_lokal').on('click', function(){
						if(confirm('Apakah anda yakin melakukan backup data NPD ? Data lokal akan diupdate sesuai data terbaru.')){
							singkron_npd_lokal();
						}
					});
				}else{
					jQuery('.aksi-extension').remove();
				}			
			}
			// DATA Pengajuan NPD
			else if(current_url.indexOf('penatausahaan/penatausahaan/pengeluaran/pengajuan/npd') != -1	){
				var title = jQuery('.card-title.custom-class').text();				
				console.log('Pengajuan | Nota Pencairan Dana', title);
				jQuery('.aksi-extension').remove();
				var btn = ''
					+'<div class="aksi-extension" style="display: inline-block;">'						
						+'<button style="margin-left: 20px;" class="btn btn-sm btn-danger" id="singkron_npd_lokal">Singkron NPD ke DB Lokal</button>'					
					+'</div>';
				jQuery('.card-title.custom-class').append(btn);				
				if(title.indexOf('Pengajuan | Nota Pencairan Dana') != -1){
					jQuery('#singkron_npd_lokal').text('Singkron NPD ke DB Lokal');
					jQuery('#singkron_npd_lokal').on('click', function(){
						if(confirm('Apakah anda yakin melakukan backup data NPD ? Data lokal akan diupdate sesuai data terbaru.')){
							singkron_npd_lokal();
						}
					});
				}else{
					jQuery('.aksi-extension').remove();
				}			
			}
			// DATA Pengajuan LPJ
			else if(current_url.indexOf('penatausahaan/penatausahaan/pengeluaran/lpj/up-gu') != -1	){
				var title = jQuery('.card-title.custom-class').text();				
				console.log('Laporan Pertanggung Jawaban | Pelimpahan  UP / GU', title);
				jQuery('.aksi-extension').remove();
				var btn = ''
					+'<div class="aksi-extension" style="display: inline-block;">'						
						+'<button style="margin-left: 20px;" class="btn btn-sm btn-danger" id="singkron_lpj_lokal">Singkron LPJ ke DB Lokal</button>'					
					+'</div>';
				jQuery('.card-title.custom-class').append(btn);				
				if(title.indexOf('Laporan Pertanggung Jawaban | Pelimpahan  UP / GU') != -1){
					jQuery('#singkron_lpj_lokal').text('Singkron LPJ ke DB Lokal');
					jQuery('#singkron_lpj_lokal').on('click', function(){
						if(confirm('Apakah anda yakin melakukan backup data LPJ ? Data lokal akan diupdate sesuai data terbaru.')){
							singkron_lpj_lokal();
						}
					});
				}else{
					jQuery('.aksi-extension').remove();
				}			
			}
			// DATA Rekening Penerimaan
			else if(current_url.indexOf('penatausahaan/penatausahaan/penerimaan/rekening/pembuatan') != -1	){
				var title = jQuery('.card-title.custom-class').text();
				console.log('Rekening Bank Satuan Kerja Perangkat Daerah (SKPD) | Pembuatan', title);
				jQuery('.aksi-extension').remove();
				var btn = ''
					+'<div class="aksi-extension" style="display: inline-block;">'						
						+'<button style="margin-left: 20px;" class="btn btn-sm btn-danger" id="singkron_rekening_penerimaan_lokal">Singkron Rekening ke DB Lokal</button>'					
					+'</div>';
				jQuery('.card-title.custom-class').append(btn);				
				if(title.indexOf('| Pembuatan') != -1){
					jQuery('#singkron_rekening_penerimaan_lokal').on('click', function(){
						if(confirm('Apakah anda yakin melakukan backup data Rekeing Penerimaan? Data lokal akan diupdate sesuai data terbaru.')){
							// singkron_sp2d_lokal(type_data);	
							singkron_rekening_penerimaan_lokal();						
						}
					});
				}else{
					jQuery('.aksi-extension').remove();
				}
			}
			// DATA Rekening Penerimaan
			else if(current_url.indexOf('penatausahaan/penatausahaan/penerimaan/stbp') != -1	){
				var title = jQuery('.card-title.custom-class').text();
				console.log('Surat Tanda Bukti Penerimaan (STBP)', title);
				jQuery('.aksi-extension').remove();
				var btn = ''
					+'<div class="aksi-extension" style="display: inline-block;">'						
						+'<button style="margin-left: 20px;" class="btn btn-sm btn-danger" id="singkron_stbp_lokal">Singkron STBP ke DB Lokal</button>'					
					+'</div>';
				jQuery('.card-title.custom-class').append(btn);				
				if(title.indexOf('Surat Tanda Bukti Penerimaan | Semua Data') != -1){
					jQuery('#singkron_stbp_lokal').on('click', function(){
						if(confirm('Apakah anda yakin melakukan backup data STBP Penerimaan? Data lokal akan diupdate sesuai data terbaru.')){
							// singkron_sp2d_lokal(type_data);	
							singkron_stbp_lokal();						
						}
					});
				}else{
					jQuery('.aksi-extension').remove();
				}
			}
			// DATA Otorisasi SPD Pembiayaan
			else if(current_url.indexOf('penatausahaan/penatausahaan/pembiayaan/spd/otorisasi') != -1	){
				var title = jQuery('.card-title.custom-class').text();
				console.log('Pembiayaan | Surat Penyediaan Dana (SPD) | Otorisasi', title);
				jQuery('.aksi-extension').remove();
				var btn = ''
					+'<div class="aksi-extension" style="display: inline-block;">'						
						+'<button style="margin-left: 20px;" class="btn btn-sm btn-danger" id="singkron_spd_pembiayaan_lokal">Singkron SPD ke DB Lokal</button>'					
					+'</div>';
				jQuery('.card-title.custom-class').append(btn);				
				if(
					title.indexOf('Surat Penyediaan Dana (SPD)') != -1
					|| title.indexOf(' | Otorisasi') != -1
				){
					jQuery('#singkron_spd_pembiayaan_lokal').text('Singkron ALL SKPD ke DB Lokal');
					jQuery('#singkron_spd_pembiayaan_lokal').on('click', function(){
						if(confirm('Apakah anda yakin melakukan backup data SPD? Data lokal akan diupdate sesuai data terbaru.')){
							singkron_spd_pembiayaan_lokal();						
						}
					});
				}else{
					jQuery('.aksi-extension').remove();
				}
			}
			// DATA Pegawai
			else if(current_url.indexOf('penatausahaan/setting/pegawai') != -1|| current_url.indexOf('penatausahaan/user') != -1)
			{
				var title = jQuery('.card-title.custom-class').text();
				console.log('halaman Pegawai', title);
				jQuery('.aksi-extension').remove();
				var btn = ''
					+'<div class="aksi-extension card-header-slot">'						
						+'<button style="margin-left: 20px;" class="btn btn-sm btn-danger" id="singkron_pegawai_lokal">Singkron Pegawai ke DB Lokal</button>'
						+'<button style="margin-left: 20px;" class="btn btn-sm btn-danger" id="singkron_panggol_lokal">Master Pangkat Golongan ke DB Lokal</button>'
						// +'<button style="margin-left: 20px;" class="btn btn-sm btn-danger" id="singkron_spd_lokal">SPD ke DB Lokal</button>'
						+'<button style="margin-left: 20px;" class="btn btn-sm btn-danger" id="singkron_up">Singkron UP ke DB Lokal</button>'
					+'</div>';
				jQuery('.card-header-slot').before(btn);
				jQuery('#singkron_pegawai_lokal').on('click', function(){
					if(confirm('Apakah anda yakin melakukan backup data pegawai? Data lokal akan diupdate sesuai data terbaru.')){
						singkron_pegawai_lokal();						
					}
				});
				jQuery('#singkron_panggol_lokal').on('click', function(){
					if(confirm('Apakah anda yakin melakukan backup data pangkat Golongan? Data lokal akan diupdate sesuai data terbaru.')){
						singkron_panggol_lokal();						
					}
				});
				jQuery('#singkron_spd_lokal').on('click', function(){
					if(confirm('Apakah anda yakin melakukan backup data SPD? Data lokal akan diupdate sesuai data terbaru.')){
						singkron_spd_lokal();						
					}
				});
				jQuery('#singkron_up').on('click', function(){
					if(confirm('Apakah anda yakin melakukan backup data UP? Data lokal akan diupdate sesuai data terbaru.')){
						singkron_up();						
					}
				});
			}
			// DATA Daftar Rekanan
			else if(current_url.indexOf('penatausahaan/penatausahaan/pengeluaran/daftar-rekanan?=1') != -1	){
				var title = jQuery('.card-title.custom-class').text();
				console.log('Daftar Rekanan', title);
				jQuery('.aksi-extension').remove();
				var btn = ''
					+'<div class="aksi-extension" style="display: inline-block;">'						
						+'<button style="margin-left: 20px;" class="btn btn-sm btn-danger" id="singkron_rekanan_lokal">Singkron Rekanan ke DB Lokal</button>'					
					+'</div>';
				jQuery('.card-title.custom-class').append(btn);				
				if(
					title.indexOf('Daftar Rekanan') != -1
				){
					jQuery('#singkron_rekanan_lokal').text('Singkron Rekanan ke DB Lokal');
					jQuery('#singkron_rekanan_lokal').on('click', function(){
						if(confirm('Apakah anda yakin melakukan backup data Rekanan? Data lokal akan diupdate sesuai data terbaru.')){
							singkron_rekanan_lokal();						
						}
					});
				}else{
					jQuery('.aksi-extension').remove();
				}
			}
			// load ulang fungsi jika title masih kosong
			if(title == ''){
				console.log('konten halaman belum terload!');
				cek_reload = true;
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
		}else if(current_url == 'https://sipd.kemendagri.go.id/logout'){
			return window.location = current_url.replace('go.id/logout', 'go.id/penatausahaan/logout');
		}

		// ulangi cek url
		if(cek_reload){
			current_url = window.location.href;
			cekUrl(current_url, nomor+1);
		}
	}, 1000);
}