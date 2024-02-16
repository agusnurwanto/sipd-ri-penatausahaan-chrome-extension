// function singkron_spp_lokal(type_data, search_value=false){
// 	return new Promise(function(resolve, reject){
// 		var type;
// 		if (type_data =='UP') {
// 			type = 'UP';
// 		}else if (type_data =='GU') {
// 			type = 'GU';
// 		}else if (type_data =='TU') {
// 			type = 'TU';
// 		}else if (type_data =='LS') {
// 			type = 'LS';
// 		}

// 		console.log('Get data All SPP!');
// 	})
// }

function singkron_spp_lokal() {
	jQuery('#wrap-loading').show();
    //var url = config.service_url+'referensi/strict/dpa/penarikan/belanja';
	var url = config.service_url+'referensi/strict/skpd/list/'+config.id_daerah+'/'+_token.tahun;
	//https://service.sipd.kemendagri.go.id/referensi/strict/skpd/list/89/2024
	relayAjaxApiKey({
	  url: url,
	  type: 'get',
	  success: function (units) {
		console.log('units', units);
		var last = units.length-1;
		units.reduce(function (sequence, nextData) {
		  	return sequence.then(function (current_data) {
				return new Promise(function (resolve_reduce, reject_reduce) {
					pesan_loading('Get SPP dari SKPD "'+current_data.kode_skpd+' '+current_data.nama_skpd+'"');
					singkron_spp_ke_lokal_skpd(current_data.id_skpd,'UP', 'draft', ()=>{
						singkron_spp_ke_lokal_skpd(current_data.id_skpd,'UP', 'diterima', ()=>{
							singkron_spp_ke_lokal_skpd(current_data.id_skpd,'UP', 'dihapus', ()=>{
								singkron_spp_ke_lokal_skpd(current_data.id_skpd,'UP', 'ditolak', ()=>{
									singkron_spp_ke_lokal_skpd(current_data.id_skpd,'GU', 'draft', ()=>{
											singkron_spp_ke_lokal_skpd(current_data.id_skpd,'GU', 'diterima',()=>{
													singkron_spp_ke_lokal_skpd(current_data.id_skpd,'GU', 'dihapus', ()=>{
															singkron_spp_ke_lokal_skpd(current_data.id_skpd,'GU', 'ditolak',()=>{
																	singkron_spp_ke_lokal_skpd(current_data.id_skpd,'TU', 'draft', ()=>{
																			singkron_spp_ke_lokal_skpd(current_data.id_skpd,'TU', 'diterima',()=>{
																					singkron_spp_ke_lokal_skpd(current_data.id_skpd,'TU', 'dihapus', ()=>{
																							singkron_spp_ke_lokal_skpd(current_data.id_skpd,'TU', 'ditolak',()=>{
																									singkron_spp_ke_lokal_skpd(current_data.id_skpd,'LS', 'draft', ()=>{
																											singkron_spp_ke_lokal_skpd(current_data.id_skpd,'LS', 'diterima',()=>{
																													singkron_spp_ke_lokal_skpd(current_data.id_skpd,'LS', 'dihapus', ()=>{
																														singkron_spp_ke_lokal_skpd(current_data.id_skpd,'LS', 'ditolak',()=>{
																															resolve_reduce(nextData);
																														});
																													});
																											});
																									});
																							});
																					});
																			});
																	});
															});
													});
											});
									});
								});
							});
						});
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
		}, Promise.resolve(units[last]))
		.then(function (data_last) {
		  jQuery("#wrap-loading").hide();
		  alert("Berhasil singkron SPP");
		});
	  },
	});
  }

  function singkron_spp_ke_lokal_skpd(skpd, tipe, status, callback) {	
	relayAjaxApiKey({
	  url: config.service_url+'pengeluaran/strict/spp/pembuatan/index?jenis='+tipe+'&status='+status,
	  type: 'get',
		//   dataType: "JSON",
	  success: function (response) {
		console.log('response spp', response);
		var spp = {
		  action: "singkron_spp",
		  tahun_anggaran: _token.tahun,
		  api_key: config.api_key,
		  idSkpd: skpd,
		  tipe: tipe,
		  sumber: 'ri',
		//   data: response,
		 data: {}
		};
		// "id_spp": 1631,
        // "nomor_spp": "35.19/02.0/000002/UP/8.01.0.00.0.00.01.0000/M/1/2024",
        // "tahun": 2024,
        // "id_daerah": 89,
        // "id_unit": 0,
        // "id_skpd": 3259,
        // "id_sub_skpd": 0,
        // "nilai_spp": 210000000,
        // "tanggal_spp": "2024-01-09T00:00:00Z",
        // "keterangan_spp": "Pembayaran Uang Persediaan (UP) Bakesbangpol Kabupaten Madiun Tahun 2024",
        // "is_verifikasi_spp": 1,
        // "verifikasi_spp_by": 0,
        // "verifikasi_spp_at": "0001-01-01T00:00:00Z",
        // "nilai_verifikasi_spp": 0,
        // "nilai_materai_spp": 0,
        // "keterangan_verifikasi_spp": "",
        // "jenis_spp": "UP",
        // "jenis_ls_spp": "",
        // "is_kunci_rekening_spp": 0,
        // "is_spm": 0,
        // "is_gaji": 0,
        // "jenis_gaji": 0,
        // "bulan_gaji": 0,
        // "tahun_gaji": 0,
        // "is_tpp": 0,
        // "bulan_tpp": 0,
        // "tahun_tpp": 0,
        // "id_pegawai_pptk": 0,
        // "id_pegawai_pa_kpa": 0,
        // "is_rekanan_upload": 0,
        // "id_kontrak": 0,
        // "id_lpj_gu": 0,
        // "id_pengajuan_tu": 0,
        // "id_ba": 0,
        // "id_sumber_dana": 0,
        // "is_status_perubahan": 0,
        // "status_perubahan_at": "0001-01-01T00:00:00Z",
        // "status_perubahan_by": 0,
        // "id_jadwal": 0,
        // "id_tahap": 0,
        // "status_tahap": "",
        // "kode_tahap": "",
        // "created_at": "2024-01-08T08:26:28.292288Z",
        // "created_by": 0,
        // "updated_at": "0001-01-01T00:00:00Z",
        // "updated_by": 0,
        // "deleted_at": "0001-01-01T00:00:00Z",
        // "deleted_by": 0,
        // "details": null
		response.map( function(b, i){    
			spp.data[i] = {}
			spp.data[i].nomorSpp = b.nomor_spp;
			spp.data[i].nilaiSpp = b.nilai_spp;
			spp.data[i].tanggalSpp = b.tanggal_spp;
			spp.data[i].keteranganSpp = b.keterangan_spp;
			spp.data[i].idSkpd = b.id_skpd;
			spp.data[i].idSubUnit = b.id_sub_skpd;
			spp.data[i].nilaiDisetujuiSpp = b.nilai_spp;
			spp.data[i].tanggalDisetujuiSpp = b.id_sub_giat;
			spp.data[i].jenisSpp = b.jenis_spp;
			spp.data[i].verifikasiSpp = b.is_verifikasi_spp;
			spp.data[i].keteranganVerifikasi = b.keterangan_verifikasi_spp;
			// spp.data[i].idSpd = b.id_spd;
			// spp.data[i].idPengesahanSpj = id_sub_giat;
			spp.data[i].kunciRekening = b.is_kunci_rekening_spp;
			// spp.data[i].alamatPenerimaSpp = id_sub_giat;
			// spp.data[i].bankPenerimaSpp = id_sub_giat;
			// spp.data[i].nomorRekeningPenerimaSpp = id_sub_giat;
			// spp.data[i].npwpPenerimaSpp = id_sub_giat;
			spp.data[i].idUser = b.created_by;
			spp.data[i].jenisLs = b.jenis_ls_spp;
			spp.data[i].isUploaded = b.is_rekanan_upload;
			spp.data[i].tahunSpp = b.tahun;
			spp.data[i].idKontrak = b.id_kontrak;
			spp.data[i].idBA = b.id_ba;
			spp.data[i].created_at = b.created_at;
			spp.data[i].updated_at = b.updated_at;
			spp.data[i].isSpm = b.is_spm;
			spp.data[i].statusPerubahan = b.status_perubahan_by;
			// spp.data[i].isDraft = id_sub_giat;
			spp.data[i].idSpp = b.id_spp;
			// spp.data[i].kodeDaerah = id_sub_giat;
			spp.data[i].idDaerah = b.id_daerah;
			spp.data[i].isGaji = b.is_gaji;
			spp.data[i].is_sptjm = b.is_sptjm;
			spp.data[i].tanggal_otorisasi = b.verifikasi_spp_at;
			spp.data[i].is_otorisasi = b.is_verifikasi_spp;
			spp.data[i].bulan_gaji = b.bulan_gaji;
			spp.data[i].id_pegawai_pptk = b.id_pegawai_pptk;
			// spp.data[i].nama_pegawai_pptk = id_sub_giat;
			// spp.data[i].nip_pegawai_pptk = id_sub_giat;
			spp.data[i].id_jadwal = b.id_jadwal;
			spp.data[i].id_tahap = b.id_tahap;
			spp.data[i].status_tahap = b.status_tahap;
			spp.data[i].kode_tahap = b.kode_tahap;
			spp.data[i].is_tpp = b.is_tpp;
			spp.data[i].bulan_tpp = b.bulan_tpp;
			spp.data[i].id_pengajuan_tu = b.id_pengajuan_tu;
			// spp.data[i].nomor_pengajuan_tu = id_sub_giat;
			// spp.data[i].id_npd = id_sub_giat;
		});
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
		  console.log("Kirim data SPP ID SKPD="+skpd+" tipe="+tipe+" status="+status+". Response From Background", resp);
		});
  
		var last = response.length-1;
		response.reduce(function (sequence, nextData) {
		  return sequence.then(function (current_data) {
			return new Promise(function (resolve_reduce, reject_reduce) {
				//https://service.sipd.kemendagri.go.id/pengeluaran/strict/spp/pembuatan/cetak/10854
				relayAjaxApiKey({
					url: config.service_url + "pengeluaran/strict/spp/pembuatan/cetak/" + current_data.id_spp,
					type: 'get',
					dataType: "JSON",
					success: function (res) {
						console.log('response detail spp', res);
					if(res.length >= 1){
						var spp_detail = {
						action: "singkron_spp_detail",
						tahun_anggaran: _token.tahun,
						api_key: config.api_key,
						idSkpd: skpd.idSkpd,
						tipe: tipe,
						data: res,
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
						},
						};
						chrome.runtime.sendMessage(data_back, (resp) => {
						window.singkron_spp_detail = {
							resolve: resolve_reduce,
							nexData: nextData
						};
						console.log("Kirim data SPP detail ID="+current_data.idSpp+" tipe="+tipe+". Response From Background", resp);
						});
					}else{
						console.log('SPP detail dengan idSpp='+current_data.idSpp+" tipe="+tipe+" kosong!");
						resolve_reduce(nextData);
					}
					}
			  });
			}).catch(function (e) {
			  console.log(e);
			  return Promise.resolve(nextData);
			});
		  })
		  .catch(function (e) {
			console.log(e);
			return Promise.resolve(nextData);
		  });
		}, Promise.resolve(response[last]))
		.then(function (data_last) {
		  callback();
		});
	  },
	});
  }