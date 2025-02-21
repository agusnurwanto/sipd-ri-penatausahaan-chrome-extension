function singkron_tbp_lokal(){
    jQuery('#wrap-loading').show();
    get_tbp({data: []})
    .then(function(tbp_all){
		alert('Berhasil singkron TBP ke lokal!');
		jQuery('#wrap-loading').hide();
    })
}

function get_tbp(opsi, page=1, limit=50){
	return new Promise(function(resolve, reject){
		var status = 'aktif';
		pesan_loading('Get data TBP, status='+status+', page='+page);
	    relayAjaxApiKey({
			url: config.service_url+'pengeluaran/strict/tbp/index?page='+page+'&limit='+limit+'&status='+status,
			type: 'get',
			success: function(data_tbp){				
				var last = data_tbp.length-1;
				data_tbp.reduce(function(sequence, nextData){
		            return sequence.then(function(current_data){
	        			return new Promise(function(resolve_reduce, reject_reduce){
							var tbp = {
								action: "singkron_tbp",
								tahun_anggaran: _token.tahun,
								api_key: config.api_key,
								idSkpd: current_data.id_skpd,
								jenis: current_data.jenis_tbp,
								sumber: 'ri',
								page: page,
							  data: {}
						  	};   
						  	tbp.data[0] = {}
						  	tbp.data[0].id_tbp = current_data.id_tbp;
						  	tbp.data[0].nomor_tbp = current_data.nomor_tbp;
						  	tbp.data[0].id_sp2d_distribusi = current_data.id_sp2d_distribusi;
						  	tbp.data[0].id_sp2d = current_data.id_sp2d;
						  	tbp.data[0].tahun = current_data.tahun;
						  	tbp.data[0].id_daerah = current_data.id_daerah;
						  	tbp.data[0].id_unit = current_data.id_unit;
						  	tbp.data[0].id_skpd = current_data.id_skpd;
						  	tbp.data[0].id_sub_skpd = current_data.id_sub_skpd;
						  	tbp.data[0].nilai_tbp = current_data.nilai_tbp;
						  	tbp.data[0].tanggal_tbp = current_data.tanggal_tbp;
						  	tbp.data[0].keterangan_tbp = current_data.keterangan_tbp;
						  	tbp.data[0].nilai_materai_tbp = current_data.nilai_materai_tbp;
						  	tbp.data[0].nomor_kwitansi = current_data.nomor_kwitansi;
						  	tbp.data[0].id_pegawai_pa_kpa = current_data.id_pegawai_pa_kpa;
						  	tbp.data[0].jenis_tbp = current_data.jenis_tbp;
						  	tbp.data[0].jenis_ls_tbp = current_data.jenis_ls_tbp;
						  	tbp.data[0].is_kunci_rekening_tbp = current_data.is_kunci_rekening_tbp;
						  	tbp.data[0].is_panjar = current_data.is_panjar;
						  	tbp.data[0].is_lpj = current_data.is_lpj;
						  	tbp.data[0].id_lpj = current_data.id_lpj;
						  	tbp.data[0].id_npd = current_data.id_npd;
						  	tbp.data[0].is_rekanan_upload = current_data.is_rekanan_upload;
						  	tbp.data[0].status_aklap = current_data.status_aklap;
						  	tbp.data[0].nomor_jurnal = current_data.nomor_jurnal;
						  	tbp.data[0].jurnal_id = current_data.jurnal_id;
						  	tbp.data[0].metode = current_data.metode;
						  	tbp.data[0].id_jadwal = current_data.id_jadwal;
						  	tbp.data[0].id_tahap = current_data.id_tahap;
						  	tbp.data[0].status_tahap = current_data.status_tahap;
						  	tbp.data[0].kode_tahap = current_data.kode_tahap;
						  	tbp.data[0].created_at = current_data.created_at;
						  	tbp.data[0].created_by = current_data.created_by;
						  	tbp.data[0].kode_skpd = current_data.kode_skpd;
						  	tbp.data[0].nama_skpd = current_data.nama_skpd;
						  	tbp.data[0].kode_sub_skpd = current_data.kode_sub_skpd;
						  	tbp.data[0].nama_sub_skpd = current_data.nama_sub_skpd;
						  	tbp.data[0].total_pertanggungjawaban = current_data.total_pertanggungjawaban;
						  	var data_back = {
								message: {
								  type: "get-url",
								  content: {
										url: config.url_server_lokal,
										type: "post",
										data: tbp,
										return: false
								  },
								},
						  	};
						  	chrome.runtime.sendMessage(data_back, (resp) => {
								pesan_loading("Kirim data TBP ID SKPD="+current_data.id_skpd+" jenis="+current_data.jenis_tbp+" nomor="+current_data.nomor_tbp+" halaman="+page);
						  	});

	        				var data_detail = {
	        					details: {},
	        					cetak_tbp: {
	        						details: []
	        					}
	        				};
	        				new Promise(function(resolve_detail, reject_detail){
			        			relayAjaxApiKey({
									url: config.service_url + "pengeluaran/strict/tbp/detail/" + current_data.id_tbp,
									type: 'get',
									dataType: "JSON",
									success: function (res) {
										console.log('response detail tbp', res);
										res.details.map(function(b, i){
											data_detail.details[b.id_detail] = {};
											data_detail.details[b.id_detail].idSkpd = current_data.id_skpd;
											data_detail.details[b.id_detail].id_tbp = current_data.id_tbp;
											data_detail.details[b.id_detail].jenis = current_data.jenis_tbp;
											data_detail.details[b.id_detail].id_detail = b.id_detail;
								            data_detail.details[b.id_detail].id_header = b.id_header;
								            data_detail.details[b.id_detail].id_akun = b.id_akun;
								            data_detail.details[b.id_detail].kode_akun = b.kode_akun;
								            data_detail.details[b.id_detail].nama_akun = b.nama_akun;
								            data_detail.details[b.id_detail].nilai_tbp_detail = b.nilai_tbp_detail;
								            data_detail.details[b.id_detail].pajak_potongan = b.pajak_potongan;
										});
					        			relayAjaxApiKey({
											url: config.service_url + "pengeluaran/strict/tbp/cetak/" + current_data.id_tbp,
											type: 'get',
											dataType: "JSON",
											success: function (res) {
												console.log('response cetak tbp', res);
												if(res.code == 500){
													pesan_loading("Error get data TBP detail ID="+current_data.id_tbp+" = "+res.message);
													return resolve_detail();
												}
												res.idSkpd = current_data.id_skpd;
												res.id_tbp = current_data.id_tbp;
												res.jenis = current_data.jenis_tbp;
												data_detail.cetak_tbp = res;
												resolve_detail();
											}
										});
									}
								});
	        				})
	        				.then(function(){
								pesan_loading("Kirim data TBP detail ID="+current_data.id_tbp+" halaman="+page);
					        	var data_back = {
								    message:{
								        type: "get-url",
								        content: {
										    url: config.url_server_lokal,
										    type: 'post',
										    data: { 
												action: 'singkron_tbp_detail',
												tahun_anggaran: _token.tahun,
												api_key: config.api_key,
												type: 'ri',
												data: data_detail
											},
							    			return: false
										}
								    }
								};
								chrome.runtime.sendMessage(data_back, function(response) {
								    console.log('responeMessage', response);
								});
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
		        }, Promise.resolve(data_tbp[last]))
		        .then(function(data_last){
					if(data_tbp.length >= limit){
						page++;
						get_tbp(opsi, page, limit)
						.then(function(newdata){
							resolve();
						});
					}else{
						resolve();
					}
		        });
			}
		});
	});
}