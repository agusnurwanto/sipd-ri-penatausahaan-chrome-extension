function singkron_spp_lokal(type_data) {
	jQuery('#wrap-loading').show();
	pesan_loading('Get data SKPD!');
	var url = config.service_url+'referensi/strict/skpd/list/'+config.id_daerah+'/'+_token.tahun;
	relayAjaxApiKey({
	  	url: url,
	  	type: 'get',
	  	success: function (units) {
			console.log('units', units);
			var last = units.length-1;
			units.reduce(function (sequence, nextData) {
			  	return sequence.then(function (current_data) {
					return new Promise(function (resolve_reduce, reject_reduce) {
						pesan_loading('Get SPP '+type_data+' dari SKPD "'+current_data.kode_skpd+' '+current_data.nama_skpd+'"');
						singkron_spp_ke_lokal_skpd(current_data.id_skpd, type_data, 'draft', ()=>{
							singkron_spp_ke_lokal_skpd(current_data.id_skpd, type_data, 'diterima', ()=>{
								singkron_spp_ke_lokal_skpd(current_data.id_skpd, type_data, 'dihapus', ()=>{
									singkron_spp_ke_lokal_skpd(current_data.id_skpd, type_data, 'ditolak', ()=>{
										resolve_reduce(nextData);
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
	  	success: function (response) {
			console.log('response spp', response);
			var spp = {
			  	action: "singkron_spp",
			  	tahun_anggaran: _token.tahun,
			  	api_key: config.api_key,
			  	idSkpd: skpd,
			  	tipe: tipe,
			  	sumber: 'ri',
			 	data: {}
			};
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
			if(tipe == 'UP'){
				return callback();
			}
	  
			var last = response.length-1;
			response.reduce(function (sequence, nextData) {
			  	return sequence.then(function (current_data) {
					return new Promise(function (resolve_reduce, reject_reduce) {
						pesan_loading('Get detail SPP dengan ID='+current_data.id_spp);
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
									idSkpd: skpd,
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
										resolve: resolve_reduce,
										nextData: nextData
									};
									console.log("Kirim data SPP detail ID="+current_data.id_spp+" tipe="+tipe+". Response From Background", resp);
								});
							},
							error: function(err){
								console.log('Error get detail SPP! id='+current_data.id_spp, err);
								resolve_reduce(nextData);
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