function singkron_lpj_lokal(status=['validasi']) {
	jQuery('#wrap-loading').show();
    get_view_skpd().then(function(all_skpd){
        var type_status = status.shift();
        new Promise(function(resolve, reject){
            if(typeof type_status == 'undefined'){
                return resolve();
            }
            var response_lpj = [];
            var last = all_skpd.length-1;
            all_skpd.reduce(function(sequence, nextData){
                return sequence.then(function (current_data) {
                    return new Promise(function (resolve_reduce, reject_reduce) {
                        singkron_lpj_lokal_per_jenis(current_data, type_status, 1, [], function(res){
                            res.map(function(b, i){
                                response_lpj.push(b);
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
            }, Promise.resolve(all_skpd[last]))
            .then(function(){
                console.log('response_lpj', response_lpj);
        		var page_skpd = {};
                var last = response_lpj.length-1;
                response_lpj.reduce(function (sequence, nextData) {
                    return sequence.then(function (current_data) {
                        return new Promise(function (resolve_reduce, reject_reduce) {
    						console.log('LPJ', current_data);
                            pesan_loading('Get LPJ '+type_status+' dari ID SKPD "'+current_data.id_skpd+'"');
                            if(!page_skpd[current_data.id_skpd]){
                                page_skpd[current_data.id_skpd] = [];
                            }
                            page_skpd[current_data.id_skpd].push(current_data);

                            // melakukan reset page sesuai data per skpd
                            current_data.page = page_skpd[current_data.id_skpd].length;

        					singkron_lpj_ke_lokal_skpd(current_data, type_status, function(){
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
        		}, Promise.resolve(response_stbp[last]))
        		.then(function (data_last) {
        		    return singkron_lpj_lokal(status);
        		});
            });
        })
        .then(function () {
            jQuery("#wrap-loading").hide();
            alert("Berhasil singkron LPJ");
        });
    });
}

function singkron_lpj_lokal_per_jenis(data_skpd, status, page=1, response_all=[], cb){
    pesan_loading('Get data LPJ ID SKPD='+data_skpd.kode_skpd+' '+data_skpd.nama_skpd+' , status='+status+', halaman='+page);
    //https://service.sipd.kemendagri.go.id/pengeluaran/strict/lpj/index-persetujuan/3253?jenis=UP%2FGU&status=validasi&page=1&limit=10&bp_bpp=bp
    
    relayAjaxApiKey({
        url: config.service_url+'pengeluaran/strict/lpj/index-persetujuan/'+data_skpd.id_skpd+'?jenis=UP%2FGU&status='+status+'&page='+page+'&bp_bpp=bp',
        type: 'get',
        success: function (response) {
            console.log('LPJ', response);
            if(response!=null && response.length >= 1){
                response.map(function(b, i){
                    response_all.push(b);
                })
                singkron_lpj_lokal_per_jenis(data_skpd, status, page+1, response_all, cb);
            }else{
                cb(response_all);
            }
        },
    });
}

function singkron_lpj_ke_lokal_skpd(current_data, status, callback) {
    var stbp = {
        action: "singkron_lpj",
        tahun_anggaran: _token.tahun,
        api_key: config.api_key,
        idSkpd: current_data.id_skpd,        
        sumber: 'ri',        
        page: current_data.page,
        data: {}
    };

    stbp.data[0] = {}
    stbp.data[0].id_lpj = current_data.id_lpj;
    stbp.data[0].nomor_lpj = current_data.nomor_lpj;
    stbp.data[0].tahun = current_data.tahun;
    stbp.data[0].id_daerah = current_data.id_daerah;    
    stbp.data[0].id_unit = current_data.id_unit;
    stbp.data[0].id_skpd = current_data.id_skpd;
	stbp.data[0].id_sub_skpd = current_data.id_sub_skpd;
	stbp.data[0].nilai_lpj = current_data.nilai_lpj;
	stbp.data[0].tanggal_lpj = current_data.tanggal_lpj;
	stbp.data[0].jenis_lpj = current_data.jenis_lpj;    
    stbp.data[0].id_pegawai_pa_kpa = current_data.id_pegawai_pa_kpa;
    stbp.data[0].is_verifikasi_lpj = current_data.is_verifikasi_lpj;
    stbp.data[0].verifikasi_lpj_at = current_data.verifikasi_lpj_at;
    stbp.data[0].verifikasi_lpj_by = current_data.verifikasi_lpj_by;    
    stbp.data[0].is_val_i_dasi_lpj = current_data.is_val_i_dasi_lpj;  
    stbp.data[0].val_i_dasi_lpj_at = current_data.val_i_dasi_lpj_at;  
    stbp.data[0].val_i_dasi_lpj_by = current_data.val_i_dasi_lpj_by;  
    stbp.data[0].is_spp_gu = current_data.is_spp_gu;  
    stbp.data[0].spp_gu_at = current_data.spp_gu_at;  
    stbp.data[0].spp_gu_by = current_data.spp_gu_by;  
    stbp.data[0].id_jadwal = current_data.id_jadwal;  
    stbp.data[0].id_tahap = current_data.id_tahap;  
    stbp.data[0].status_tahap = current_data.status_tahap;  
    stbp.data[0].kode_tahap = current_data.kode_tahap;  
    stbp.data[0].created_at = current_data.created_at;  
    stbp.data[0].created_by = current_data.created_by;    
    stbp.data[0].kode_skpd = current_data.kode_skpd;  
    stbp.data[0].nama_skpd = current_data.nama_skpd;  
    stbp.data[0].kode_sub_skpd = current_data.kode_sub_skpd;  
    stbp.data[0].nama_sub_skpd = current_data.nama_sub_skpd;  
    stbp.data[0].status = status;    
    
    
    var data_back = {
        message: {
            type: "get-url",
            content: {
                url: config.url_server_lokal,
                type: "post",
                data: stbp,
                return: false
            },
        },
    };
    chrome.runtime.sendMessage(data_back, (resp) => {
        pesan_loading("Kirim data LPJ ID SKPD="+current_data.id_skpd+" status="+status+" nomor = "+current_data.nomor_lpj);
    });

    new Promise(function (resolve, reject) {
        //https://service.sipd.kemendagri.go.id/pengeluaran/strict/lpj/cetak/11094?tipe=bp&id_skpd=3253
        jQuery.ajax({
            url: config.service_url + "pengeluaran/strict/lpj/cetak/" + current_data.id_lpj+"?tipe=bp&id_skpd="+current_data.id_skpd,
            type: 'get',
            dataType: "JSON",
            beforeSend: function (xhr) {                
                xhr.setRequestHeader("Authorization", 'Bearer '+getCookie('X-SIPD-PU-TK'));
            },
            success: function (res) {
                console.log('response detail LPJ', res);
                var lpj_detail = {
                    action: "singkron_lpj_detail",
                    tahun_anggaran: _token.tahun,
                    api_key: config.api_key,
                    idSkpd: current_data.id_skpd,
                    id_lpj: current_data.id_lpj,
                    sumber: 'ri',
                    data: res[res]
                };
                var data_back = {
                    message: {
                        type: "get-url",
                        content: {
                            url: config.url_server_lokal,
                            type: "post",
                            data: lpj_detail,
                            return: true
                        },
                    }
                };
                chrome.runtime.sendMessage(data_back, (resp) => {
                    window.singkron_lpj_detail = {
                        resolve: resolve
                    };
                    pesan_loading("Kirim data LPJ detail ID="+current_data.id_lpj+" status="+status);
                });
            },
            error: function(err){
                console.log('Error get detail STBP! id='+current_data.id_stbp, err);
                resolve();
            }
        });
    })
    .then(function () {
        callback();
    });
}

function get_lpj(opsi, page=1, limit=50){
	return new Promise(function(resolve, reject){
		var status = 'validasi';
		pesan_loading('Get data LPJ BPP, status='+status+', page='+page);
	    relayAjaxApiKey({
			// https://service.sipd.kemendagri.go.id/pengeluaran/strict/lpj/index-persetujuan/2980?jenis=UP%2FGU&status=validasi&page=1&limit=10&bp_bpp=bp
			url: config.service_url+'pengeluaran/strict/lpj/index-persetujuan/'+_token.id_skpd+'?jenis=UP%2F&status='+status+'&page='+page+'&limit='+limit+'&bp_bpp=bp',
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

function singkron_lpj_adm_lokal(page=1, skpd_all=[]){
	alert('BELUM YA!');
	jQuery('#wrap-loading').show();
}

function get_skpd(){	
	// https://service.sipd.kemendagri.go.id/referensi/strict/skpd/list/89/2024
}
// function singkron_lpj_fungsional_lokal(val){
//     jQuery('#wrap-loading').show();
// 	var bulan = val;
//     get_lpj_fungsional({data: []})
//     .then(function(lpj_fungsional){
// 		alert('Berhasil singkron LPJ ke lokal!');
// 		jQuery('#wrap-loading').hide();
//     })
// }
function singkron_lpj_fungsional_lokal(val) {
	jQuery('#wrap-loading').show();	
    get_view_skpd().then(function(all_skpd){  
		var bulan = val;
		console.log(bulan);      
        // new Promise(function(resolve, reject){            
        //     var response_lpj_fungsional = [];
        //     var last = all_skpd.length-1;
        //     all_skpd.reduce(function(sequence, nextData){
        //         return sequence.then(function (current_data) {
        //             return new Promise(function (resolve_reduce, reject_reduce) {
        //                 get_singkron_lpj_fungsional(current_data, bulan, function(res){
		// 					// console.log(res);
		// 					// process.exit(1);
        //                     res.map(function(b, i){
        //                         response_lpj_fungsional.push(b);
        //                     });
        //                     resolve_reduce(nextData);
        //                 });
        //             })
        //             .catch(function(e){
        //                 console.log(e);
        //                 return Promise.resolve(nextData);
        //             });
        //         })
        //         .catch(function(e){
        //             console.log(e);
        //             return Promise.resolve(nextData);
        //         });
        //     }, Promise.resolve(all_skpd[last]))
        //     .then(function(){
        //         console.log('response_lpj_fungsional', response_lpj_fungsional);
        // 		var page_skpd = {};
        //         var last = response_lpj_fungsional.length-1;
        //         response_lpj_fungsional.reduce(function (sequence, nextData) {
        //             return sequence.then(function (current_data) {
        //                 return new Promise(function (resolve_reduce, reject_reduce) {
    	// 					console.log('LPJ Fungsional', current_data);
        //                     pesan_loading('Get LPJ Fungsional Bulan "'+bulan+'" dari SKPD "'+current_data.id_skpd+'" '+current_data.nama_skpd+'');
        //                     if(!page_skpd[current_data.id_skpd]){
        //                         page_skpd[current_data.id_skpd] = [];
        //                     }
        //                     page_skpd[current_data.id_skpd].push(current_data);

        //                     // melakukan reset page sesuai data per skpd
        //                     current_data.page = page_skpd[current_data.id_skpd].length;

        // 					singkron_lpj_fungsional_ke_lokal_skpd(current_data, bulan, function(){
        //                         resolve_reduce(nextData);
        //   		            });
        // 				})
        // 				.catch(function(e){
        // 					console.log(e);
        // 					return Promise.resolve(nextData);
        // 				});
        // 			})
        // 			.catch(function(e){
        // 				console.log(e);
        // 				return Promise.resolve(nextData);
        // 			});
        // 		}, Promise.resolve(response_lpj_fungsional[last]))
        // 		.then(function (data_last) {
        // 		    return singkron_lpj_fungsional_lokal();
        // 		});
        //     });
        // })
        // .then(function () {            
        //     alert("Berhasil singkron LPJ Fungsional");
		// 	jQuery("#wrap-loading").hide();
        // });
    });
}

function get_singkron_lpj_fungsional(data_skpd, bulan, page=1, response_all=[], cb){
    pesan_loading('Get data LPJ Fungsional Bulan "'+bulan+'" SKPD='+data_skpd.kode_skpd+' '+data_skpd.nama_skpd);
	// process.exit(1);
    relayAjaxApiKey({
		// https://service.sipd.kemendagri.go.id/pengeluaran/strict/lpj/adm-fungs/3253?type=SKPD&id_pegawai=0&bulan=1
        url: config.service_url+'pengeluaran/strict/lpj/adm-fungs/'+data_skpd.id_skpd+'?type=SKPD&id_pegawai=0&bulan='+bulan,
        type: 'get',
        success: function (response) {
            console.log('LPJ', response);			
            if(response!=null && response.length >= 1){
                response.map(function(b, i){
                    response_all.push(b);
                })
                get_singkron_lpj_fungsional(data_skpd, page+1, response_all, cb);
            }else{
                cb(response_all);
            }
        },
    });
}

function singkron_lpj_fungsional_ke_lokal_skpd(current_data, callback) {
	console.log('LPJ Fungsional', current_data);
    var stbp = {
        action: "singkron_lpj_fungsional",
        tahun_anggaran: _token.tahun,
        api_key: config.api_key,
        idSkpd: current_data.id_skpd,        
        sumber: 'ri',        
        page: current_data.page,
        data: {}
    };

    // stbp.data[0] = {}
    // stbp.data[0].id_stbp = current_data.id_stbp;
    // stbp.data[0].nomor_stbp = current_data.nomor_stbp;
    // stbp.data[0].no_rekening = current_data.no_rekening;
    // stbp.data[0].metode_penyetoran = current_data.metode_penyetoran;    
    // stbp.data[0].keterangan_stbp = current_data.keterangan_stbp;
    // stbp.data[0].is_verifikasi_stbp = current_data.is_verifikasi_stbp;
	// stbp.data[0].is_otorisasi_stbp = current_data.is_otorisasi_stbp;
	// stbp.data[0].is_validasi_stbp = current_data.is_validasi_stbp;
	// stbp.data[0].tanggal_stbp = current_data.tanggal_stbp;
	// stbp.data[0].tahun_anggaran = current_data.tahun;    
    // stbp.data[0].id_daerah = current_data.id_daerah;
    // stbp.data[0].id_unit = current_data.id_unit;
    // stbp.data[0].id_skpd = current_data.id_skpd;
    // stbp.data[0].id_sub_skpd = current_data.id_sub_skpd;    
    // stbp.data[0].is_sts = current_data.is_sts;    
    // stbp.data[0].status = status;    
    // stbp.data[0].created_at = current_data.created_at;
    
    // var data_back = {
    //     message: {
    //         type: "get-url",
    //         content: {
    //             url: config.url_server_lokal,
    //             type: "post",
    //             data: stbp,
    //             return: false
    //         },
    //     },
    // };
    // chrome.runtime.sendMessage(data_back, (resp) => {
    //     pesan_loading("Kirim data STBP ID SKPD="+current_data.id_skpd+" status="+status+" keterangan = "+current_data.keterangan_stbp);
    // });

    // new Promise(function (resolve, reject) {
    //     jQuery.ajax({
    //         url: config.service_url + "penerimaan/strict/stbp/cetak/" + current_data.id_stbp,
    //         type: 'get',
    //         dataType: "JSON",
    //         beforeSend: function (xhr) {                
    //             xhr.setRequestHeader("Authorization", 'Bearer '+getCookie('X-SIPD-PU-TK'));
    //         },
    //         success: function (res) {
    //             console.log('response detail stbp', res);
    //             var stbp_detail = {
    //                 action: "singkron_stbp_detail",
    //                 tahun_anggaran: _token.tahun,
    //                 api_key: config.api_key,
    //                 idSkpd: current_data.id_skpd,
    //                 id_stbp: current_data.id_stbp,
    //                 sumber: 'ri',
    //                 data: res[res]
    //             };
    //             var data_back = {
    //                 message: {
    //                     type: "get-url",
    //                     content: {
    //                         url: config.url_server_lokal,
    //                         type: "post",
    //                         data: stbp_detail,
    //                         return: true
    //                     },
    //                 }
    //             };
    //             chrome.runtime.sendMessage(data_back, (resp) => {
    //                 window.singkron_stbp_detail = {
    //                     resolve: resolve
    //                 };
    //                 pesan_loading("Kirim data STBP detail ID="+current_data.id_stbp+" status="+status);
    //             });
    //         },
    //         error: function(err){
    //             console.log('Error get detail STBP! id='+current_data.id_stbp, err);
    //             resolve();
    //         }
    //     });
    // })
    // .then(function () {
    //     callback();
    // });
}