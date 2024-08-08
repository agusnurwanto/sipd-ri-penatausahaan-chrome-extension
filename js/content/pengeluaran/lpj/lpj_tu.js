function singkron_lpj_tu_lokal(){
    jQuery('#wrap-loading').show();
    get_lpj_tu({data: []})
    .then(function(lpj_all){
		alert('Berhasil singkron LPJ TU BPP ke lokal!');
		jQuery('#wrap-loading').hide();
    })
}

function get_lpj_tu(opsi, page=1, limit=50){
	return new Promise(function(resolve, reject){
		var status = 'validasi';
		pesan_loading('Get data LPJ TU BPP, status='+status+', page='+page);
	    relayAjaxApiKey({
			// https://service.sipd.kemendagri.go.id/pengeluaran/strict/lpj/index-persetujuan/2980?jenis=UP%2FGU&status=validasi&page=1&limit=10&bp_bpp=bp
			url: config.service_url+'pengeluaran/strict/lpj/index-tu/'+_token.id_skpd+'?jenis=TU%2F&status='+status+'&page='+page+'&limit='+limit+'&bp_bpp=bp',
			type: 'get',
			success: function(data_lpj){	
					console.log(data_lpj.lpj_bpp);
					var last = data_lpj.lpj_bpp.length-1;
					data_lpj.lpj_bpp.reduce(function(sequence, nextData){
			            return sequence.then(function(current_data){
							var lpj = {
								action: "singkron_lpj_bpp",
								tahun_anggaran: _token.tahun,
								api_key: config.api_key,
								idSkpd: current_data.id_skpd,	  	
								sumber: 'ri',
								page: current_data.page,
								data: {},
								page: page,
						  };   
                         
						  	lpj.data[0] = {}
							lpj.data[0].id_lpj_bpp = current_data.id_lpj_bpp;
							lpj.data[0].nomor_lpj_bpp = current_data.nomor_lpj_bpp;
							lpj.data[0].tahun = current_data.tahun;
							lpj.data[0].id_daerah = _token.id_daerah;
							lpj.data[0].id_unit = current_data.id_unit;
							lpj.data[0].id_skpd = current_data.id_skpd;
                            lpj.data[0].id_sub_skpd = current_data.id_sub_skpd;
							lpj.data[0].nilai_lpj_bpp = current_data.nilai_lpj_bpp;
							lpj.data[0].tanggal_lpj_bpp = current_data.tanggal_lpj_bpp;
                            lpj.data[0].jenis_lpj_bpp = current_data.jenis_lpj_bpp;                            
							lpj.data[0].id_pegawai_pa_kpa = current_data.id_pegawai_pa_kpa;
							lpj.data[0].is_verifikasi_lpj_bpp = current_data.is_verifikasi_lpj_bpp;
                            lpj.data[0].verifikasi_lpj_bpp_at = current_data.verifikasi_lpj_bpp_at;														
							lpj.data[0].verifikasi_lpj_by = current_data.verifikasi_lpj_bpp_by;
							lpj.data[0].is_val_i_dasi_lpj_bpp = current_data.is_val_i_dasi_lpj_bpp;
							lpj.data[0].val_i_dasi_lpj_bpp_at = current_data.val_i_dasi_lpj_bpp_at;
							lpj.data[0].val_i_dasi_lpj_bpp_by = current_data.val_i_dasi_lpj_bpp_by;
							lpj.data[0].is_spp_gu = current_data.is_spp_gu;
							lpj.data[0].spp_gu_at = current_data.spp_gu_at;
							lpj.data[0].spp_gu_by = current_data.spp_gu_by;
							lpj.data[0].id_jadwal = current_data.id_jadwal;
							lpj.data[0].id_tahap = current_data.id_tahap;
							lpj.data[0].status_tahap = current_data.status_tahap;
							lpj.data[0].kode_tahap = current_data.kode_tahap;
							lpj.data[0].created_at = current_data.created_at;							
							lpj.data[0].created_by = current_data.created_by;
							lpj.data[0].updated_at = current_data.updated_at;
							lpj.data[0].updated_by = current_data.updated_by;
							lpj.data[0].deleted_at = current_data.deleted_at;
							lpj.data[0].deleted_by = current_data.deleted_by;
							lpj.data[0].kode_skpd = current_data.kode_skpd;
							lpj.data[0].nama_skpd = current_data.nama_skpd;
							lpj.data[0].kode_sub_skpd = current_data.kode_sub_skpd;
							lpj.data[0].nama_sub_skpd = current_data.nama_sub_skpd;
						  var data_back = {
								message: {
								  type: "get-url",
								  content: {
										url: config.url_server_lokal,
										type: "post",
										data: lpj,
										return: false
								  },
								},
						  };
						  chrome.runtime.sendMessage(data_back, (resp) => {
							pesan_loading("Kirim data LPJ BPP ID SKPD="+current_data.id_skpd+" status="+status+" nomor="+current_data.nomor_lpj_bpp+" halaman="+page);
						  });
			        		return new Promise(function(resolve_reduce, reject_reduce){
			        			relayAjaxApiKey({
									//https://service.sipd.kemendagri.go.id/pengeluaran/strict/lpj/cetak/4779?tipe=bpp&id_skpd=2973
									url: config.service_url + "pengeluaran/strict/lpj/cetak/"+current_data.id_lpj_bpp+'?tipe=bpp&id_skpd='+current_data.id_skpd,
									type: 'get',
									dataType: "JSON",
									beforeSend: function (xhr) {			    
										xhr.setRequestHeader("Authorization", 'Bearer '+getCookie('X-SIPD-PU-TK'));
									},
									success: function (res) {
										console.log('response detail LPJ BPP', res);
										pesan_loading("Kirim data LPJ BPP detail ID="+current_data.id_lpj_bpp+" ID SKPD="+current_data.id_skpd+" halaman="+page);
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
										res.id_lpj = current_data.id_lpj_bpp;
										opsi.data.push(res);
										resolve_reduce(nextData);
									},
									error: function(err){
										console.log('Error get detail LPJ BPP! id='+current_data.id_lpj_bpp, err);
										resolve();
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
			        }, Promise.resolve(data_lpj.lpj_bpp[last]))
			        .then(function(data_last){
			        	var data_back = {
						    message:{
						        type: "get-url",
						        content: {
								    url: config.url_server_lokal,
								    type: 'post',
								    data: { 
										action: 'singkron_lpj_detail',
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

						if(data_lpj.lpj_bpp.length >= limit){
							// dikosongkan lagi setelah data dikirim ke lokal
							opsi.data = [];
							page++;
							get_npd(opsi, page, limit)
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