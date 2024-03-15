function singkron_tbp_lokal(){
    jQuery('#wrap-loading').show();
    get_tbp({data: []})
    .then(function(tbp_all){
		alert('Berhasil singkron TBP ke lokal!');
		jQuery('#wrap-loading').hide();
    })
}

function get_tbp(opsi, page=1, limit=20){
	return new Promise(function(resolve, reject){
		var status = 'aktif';
		pesan_loading('Get data TBP, status='+status+', page='+page);
	    relayAjaxApiKey({
			url: config.service_url+'pengeluaran/strict/tbp/index/0?page='+page+'&limit='+limit+'&status='+status,
			type: 'get',
			success: function(data_tbp){				
					var last = data_tbp.length-1;
					data_tbp.reduce(function(sequence, nextData){
			            return sequence.then(function(current_data){
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
			        		return new Promise(function(resolve_reduce, reject_reduce){
			        			relayAjaxApiKey({
									url: config.service_url + "pengeluaran/strict/tbp/cetak/" + current_data.id_tbp,
									type: 'get',
									dataType: "JSON",
									beforeSend: function (xhr) {			    
										xhr.setRequestHeader("Authorization", 'Bearer '+getCookie('X-SIPD-PU-TK'));
									},
									success: function (res) {
										console.log('response detail tbp', res);
										pesan_loading("Kirim data TBP detail ID="+current_data.id_tbp+" halaman="+page);
										// var tbp_detail = {
										// 	action: "singkron_tbp_detail",
										// 	tahun_anggaran: _token.tahun,
										// 	api_key: config.api_key,
										// 	idSkpd: current_data.id_skpd,
										// 	id_tbp: current_data.id_tbp,
										// 	jenis: current_data.jenis_tbp,
										// 	sumber: 'ri',
										// 	data: res
										// };
										res.idSkpd = current_data.id_skpd;
										res.id_tbp = current_data.id_tbp;
										res.jenis = current_data.jenis_tbp;
										opsi.data.push(res);
										resolve_reduce(nextData);
									}
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
										data: opsi.data
									},
					    			return: false
								}
						    }
						};
						chrome.runtime.sendMessage(data_back, function(response) {
						    console.log('responeMessage', response);
						});

						if(data_tbp.length >= limit){
							// dikosongkan lagi setelah data dikirim ke lokal
							opsi.data = [];
							page++;
							get_tbp(opsi, page, limit)
							.then(function(newdata){
								resolve(newdata);
							});
						}else{
							resolve(opsi.data);
						}
			        });
				
			}
		});
	});
}

function singkron_tbp_ke_lokal_skpd(data_tbp, page, callback) {
	console.log('mau kirim data tbp', data_tbp);
	var tbp = {
	  	action: "singkron_tbp",
	  	tahun_anggaran: _token.tahun,
	  	api_key: config.api_key,
	  	idSkpd: data_tbp.id_skpd,
	  	jenis: data_tbp.jenis_tbp,
	  	sumber: 'ri',
	  	page: page,
		data: {}
	};   
	tbp.data[0] = {}
	tbp.data[0].id_tbp = data_tbp.id_tbp;
	tbp.data[0].id_sp2d_distribusi = data_tbp.id_sp2d_distribusi;
	tbp.data[0].id_sp2d = data_tbp.id_sp2d;
	tbp.data[0].tahun = data_tbp.tahun;
	tbp.data[0].id_daerah = data_tbp.id_daerah;
	tbp.data[0].id_unit = data_tbp.id_unit;
	tbp.data[0].id_skpd = data_tbp.id_skpd;
	tbp.data[0].id_sub_skpd = data_tbp.id_sub_skpd;
	tbp.data[0].nilai_tbp = data_tbp.nilai_tbp;
	tbp.data[0].tanggal_tbp = data_tbp.tanggal_tbp;
	tbp.data[0].keterangan_tbp = data_tbp.keterangan_tbp;
	tbp.data[0].nilai_materai_tbp = data_tbp.nilai_materai_tbp;
	tbp.data[0].nomor_kwitansi = data_tbp.nomor_kwitansi;
	tbp.data[0].id_pegawai_pa_kpa = data_tbp.id_pegawai_pa_kpa;
	tbp.data[0].jenis_tbp = data_tbp.jenis_tbp;
	tbp.data[0].jenis_ls_tbp = data_tbp.jenis_ls_tbp;
	tbp.data[0].is_kunci_rekening_tbp = data_tbp.is_kunci_rekening_tbp;
	tbp.data[0].is_panjar = data_tbp.is_panjar;
	tbp.data[0].is_lpj = data_tbp.is_lpj;
	tbp.data[0].id_lpj = data_tbp.id_lpj;
	tbp.data[0].id_npd = data_tbp.id_npd;
	tbp.data[0].is_rekanan_upload = data_tbp.is_rekanan_upload;
	tbp.data[0].status_aklap = data_tbp.status_aklap;
	tbp.data[0].nomor_jurnal = data_tbp.nomor_jurnal;
	tbp.data[0].jurnal_id = data_tbp.jurnal_id;
	tbp.data[0].metode = data_tbp.metode;
	tbp.data[0].id_jadwal = data_tbp.id_jadwal;
	tbp.data[0].id_tahap = data_tbp.id_tahap;
	tbp.data[0].status_tahap = data_tbp.status_tahap;
	tbp.data[0].kode_tahap = data_tbp.kode_tahap;
	tbp.data[0].created_at = data_tbp.created_at;
	tbp.data[0].created_by = data_tbp.created_by;
	tbp.data[0].kode_skpd = data_tbp.kode_skpd;
	tbp.data[0].nama_skpd = data_tbp.nama_skpd;
	tbp.data[0].kode_sub_skpd = data_tbp.kode_sub_skpd;
	tbp.data[0].nama_sub_skpd = data_tbp.nama_sub_skpd;
	tbp.data[0].total_pertanggungjawaban = data_tbp.total_pertanggungjawaban;
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
	  	pesan_loading("Kirim data TBP ID SKPD="+data_tbp.id_skpd+" jenis="+data_tbp.jenis_tbp+" nomor="+data_tbp.nomor_tbp+" halaman="+page);
	});
}