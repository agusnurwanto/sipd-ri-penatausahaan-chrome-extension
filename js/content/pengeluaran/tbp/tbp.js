function singkron_tbp_lokal() {
	jQuery('#wrap-loading').show();
	// status = draft , diterima , dihapus , ditolak
	var status = 'aktif';
	pesan_loading('Get data TBP, status='+status);
	relayAjaxApiKey({
  		url: config.service_url+'pengeluaran/strict/tbp/index/0?is_panjar=1&jenis=UP&status='+status,
	  	type: 'get',
	  	success: function (response) {
			console.log('TBP', response);
			var page_skpd = {};
			var last = response.length-1;
			response.reduce(function (sequence, nextData) {
			  	return sequence.then(function (current_data) {
					return new Promise(function (resolve_reduce, reject_reduce) {
						pesan_loading('Get TBP dari ID SKPD "'+current_data.id_skpd+'"');
						if(!page_skpd[current_data.id_skpd]){
							page_skpd[current_data.id_skpd] = [];
						}
						page_skpd[current_data.id_skpd].push(current_data);

						// melakukan reset page sesuai data per skpd
						current_data.page = page_skpd[current_data.id_skpd].length;

						singkron_spp_ke_lokal_skpd(current_data, type_data, status, ()=>{
							resolve_reduce(nextData);
				  		});
					})
					.catch(function(e){
						console.log(e);
						return Promise.resolve(nextData);
					});
				})
				.catch(function(e){
					console.log(e);
					return Promise.resolve(nextData);
				});
			}, Promise.resolve(response[last]))
			.then(function (data_last) {
			  	jQuery("#wrap-loading").hide();
			  	alert("Berhasil singkron SPP");
			});
	  	},
	});
}

function singkron_spp_ke_lokal_skpd(current_data, tipe, status, callback) {
	var spp = {
	  	action: "singkron_spp",
	  	tahun_anggaran: _token.tahun,
	  	api_key: config.api_key,
	  	idSkpd: current_data.id_skpd,
	  	tipe: tipe,
	  	sumber: 'ri',
	  	page: current_data.page,
	 	data: {}
	};   
	spp.data[0] = {}
	spp.data[0].nomorSpp = current_data.nomor_spp;
	spp.data[0].nilaiSpp = current_data.nilai_spp;
	spp.data[0].tanggalSpp = current_data.tanggal_spp;
	spp.data[0].keteranganSpp = current_data.keterangan_spp;
	spp.data[0].idSkpd = current_data.id_skpd;
	spp.data[0].idSubUnit = current_data.id_sub_skpd;
	spp.data[0].nilaiDisetujuiSpp = current_data.nilai_spp;
	spp.data[0].tanggalDisetujuiSpp = current_data.id_sub_giat;
	spp.data[0].jenisSpp = current_data.jenis_spp;
	spp.data[0].verifikasiSpp = current_data.is_verifikasi_spp;
	spp.data[0].keteranganVerifikasi = current_data.keterangan_verifikasi_spp;
	// spp.data[0].idSpd = current_data.id_spd;
	// spp.data[0].idPengesahanSpj = id_sub_giat;
	spp.data[0].kunciRekening = current_data.is_kunci_rekening_spp;
	// spp.data[0].alamatPenerimaSpp = id_sub_giat;
	// spp.data[0].bankPenerimaSpp = id_sub_giat;
	// spp.data[0].nomorRekeningPenerimaSpp = id_sub_giat;
	// spp.data[0].npwpPenerimaSpp = id_sub_giat;
	spp.data[0].idUser = current_data.created_by;
	spp.data[0].jenisLs = current_data.jenis_ls_spp;
	spp.data[0].isUploaded = current_data.is_rekanan_upload;
	spp.data[0].tahunSpp = current_data.tahun;
	spp.data[0].idKontrak = current_data.id_kontrak;
	spp.data[0].idBA = current_data.id_ba;
	spp.data[0].created_at = current_data.created_at;
	spp.data[0].updated_at = current_data.updated_at;
	spp.data[0].isSpm = current_data.is_spm;
	spp.data[0].statusPerubahan = current_data.status_perubahan_by;
	// spp.data[0].isDraft = id_sub_giat;
	spp.data[0].idSpp = current_data.id_spp;
	// spp.data[0].kodeDaerah = id_sub_giat;
	spp.data[0].idDaerah = current_data.id_daerah;
	spp.data[0].isGaji = current_data.is_gaji;
	spp.data[0].is_sptjm = current_data.is_sptjm;
	spp.data[0].tanggal_otorisasi = current_data.verifikasi_spp_at;
	spp.data[0].is_otorisasi = current_data.is_verifikasi_spp;
	spp.data[0].bulan_gaji = current_data.bulan_gaji;
	spp.data[0].id_pegawai_pptk = current_data.id_pegawai_pptk;
	// spp.data[0].nama_pegawai_pptk = id_sub_giat;
	// spp.data[0].nip_pegawai_pptk = id_sub_giat;
	spp.data[0].id_jadwal = current_data.id_jadwal;
	spp.data[0].id_tahap = current_data.id_tahap;
	spp.data[0].status_tahap = current_data.status_tahap;
	spp.data[0].kode_tahap = current_data.kode_tahap;
	spp.data[0].is_tpp = current_data.is_tpp;
	spp.data[0].bulan_tpp = current_data.bulan_tpp;
	spp.data[0].id_pengajuan_tu = current_data.id_pengajuan_tu;
	// spp.data[0].nomor_pengajuan_tu = id_sub_giat;
	// spp.data[0].id_npd = id_sub_giat;
	var data_back = {
	 	 message: {
			type: "get-url",
			content: {
			  	url: config.url_server_lokal,
			  	type: "post",
			  	data: spp,
			  	return: false
			},
	  	},
	};
	chrome.runtime.sendMessage(data_back, (resp) => {
	  	pesan_loading("Kirim data SPP ID SKPD="+current_data.id_skpd+" tipe="+tipe+" status="+status+" nomor="+current_data.nomor_spp);
	});
	if(tipe == 'UP'){
		return callback();
	}

	new Promise(function (resolve, reject) {
		jQuery.ajax({
			url: config.service_url + "pengeluaran/strict/spp/pembuatan/cetak/" + current_data.id_spp,
			type: 'get',
			dataType: "JSON",
			beforeSend: function (xhr) {			    
				xhr.setRequestHeader("Authorization", 'Bearer '+getCookie('X-SIPD-PU-TK'));
			},
			success: function (res) {
				console.log('response detail spp', res);
				var spp_detail = {
					action: "singkron_spp_detail",
					tahun_anggaran: _token.tahun,
					api_key: config.api_key,
					idSkpd: current_data.id_skpd,
					id_spp: current_data.id_spp,
					tipe: tipe,
					sumber: 'ri',
					data: res[res.jenis.toLowerCase()]
				};
				var data_back = {
					message: {
						type: "get-url",
						content: {
							url: config.url_server_lokal,
							type: "post",
							data: spp_detail,
							return: true
						},
					}
				};
				chrome.runtime.sendMessage(data_back, (resp) => {
					window.singkron_spp_detail = {
						resolve: resolve
					};
					pesan_loading("Kirim data SPP detail ID="+current_data.id_spp+" tipe="+tipe);
				});
			},
			error: function(err){
				console.log('Error get detail SPP! id='+current_data.id_spp, err);
				resolve();
			}
	  	});
  	})
  	.then(function () {
	  	callback();
	});
}