function singkron_belanja_dashboard_ke_lokal() {    
// https://service.sipd.kemendagri.go.id/referensi/strict/statistik/dashboard
// https://service.sipd.kemendagri.go.id/pengeluaran/strict/dashboard/statistik-belanja
// skpd https://service.sipd.kemendagri.go.id/pengeluaran/strict/dashboard/statistik-belanja/3253->id_skpd
// program https://service.sipd.kemendagri.go.id/pengeluaran/strict/dashboard/statistik-belanja/3253/3253->id_sub_skpd
// kegiatan https://service.sipd.kemendagri.go.id/pengeluaran/strict/dashboard/statistik-belanja/3253/3253/1186->id_program
// subkegiatan https://service.sipd.kemendagri.go.id/pengeluaran/strict/dashboard/statistik-belanja/3253/3253/1186/8709->id_giat
// rekening/akun https://service.sipd.kemendagri.go.id/pengeluaran/strict/dashboard/statistik-belanja/3253/3253/1186/8709->id_sub_giat
    jQuery('#wrap-loading').show();
    // pesan_loading('Get SKPD halaman = '+page);
    var url = config.service_url+'pengeluaran/strict/dashboard/statistik-belanja';
    return new Promise(function(resolve, reduce){
	    relayAjaxApiKey({
			url: url,
			type: 'get',
			success: function(data_skpd_all){
				// if(data_skpd_all!=null && data_skpd_all.length >= 1){
				// 	data_skpd_all.map(function(b, i){
				// 		skpd_all.push(b);
				// 	})
				// 	singkron_belanja_dashboard_ke_lokal(page+1, skpd_all);
				// 	return resolve();
				// }else{
					var last = data_skpd_all.length-1;
					data_skpd_all.reduce(function(sequence, nextData){
		                return sequence.then(function(current_data){
		            		return new Promise(function(resolve_reduce, reject_reduce){
		            			pesan_loading('Get sub SKPD dari SKPD "'+current_data.kode_skpd+' '+current_data.nama_skpd+'"');
		            			get_sub_skpd(current_data.id_skpd, function(){
		            				return resolve_reduce(nextData);
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
		            }, Promise.resolve(data_skpd_all[last]))
		            .then(function(data_last){
		        		alert('Berhasil backup data realisasi APBD ke lokal!');
						jQuery('#wrap-loading').hide();
						return resolve();
		            });
		        
			}
        });
    });
}

function get_sub_skpd(id_skpd, callback){
	var url = config.service_url+'pengeluaran/strict/dashboard/statistik-belanja/'+id_skpd;
	relayAjaxApiKey({
		url: url,
		type: 'get',
		success: function(ret){
			update_bl_realisasi_nonactive(id_skpd, 'belanja')
			.then(function(){
				var last = ret.length-1;
				ret.reduce(function(sequence, nextData){
	                return sequence.then(function(current_data){
	            		return new Promise(function(resolve_reduce, reject_reduce){
	            			pesan_loading('Get Program "'+current_data.kode_sub_skpd+' '+current_data.nama_sub_skpd+'" '+current_data.realisasi_rencana+' '+current_data.realisasi_rill);
	            			get_program(current_data.id_skpd, current_data.id_sub_skpd, function(){
	            				return resolve_reduce(nextData);
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
	            }, Promise.resolve(ret[last]))
	            .then(function(data_last){
	            	if(callback){
	            		callback();
	            	}else{
		        		alert('Berhasil backup data realisasi APBD ke lokal!');
						jQuery('#wrap-loading').hide();
	            	}
	            });
			});
		}
	});
}

function get_program(id_skpd, id_sub_skpd, callback){
	var url = config.service_url+'pengeluaran/strict/dashboard/statistik-belanja/'+id_skpd+'/'+id_sub_skpd;
	relayAjaxApiKey({
		url: url,
		type: 'get',
		success: function(ret){
			update_bl_realisasi_nonactive(id_sub_skpd, 'belanja')
			.then(function(){
				var last = ret.length-1;
				ret.reduce(function(sequence, nextData){
	                return sequence.then(function(current_data){
	            		return new Promise(function(resolve_reduce, reject_reduce){
	            			pesan_loading('Get kegiatan "'+current_data.kode_program+' '+current_data.nama_program+'" '+current_data.kode_sub_skpd+' '+current_data.nama_sub_skpd);
	            			get_kegiatan(current_data.id_skpd, current_data.id_sub_skpd, current_data.id_program, function(){
	            				return resolve_reduce(nextData);
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
	            }, Promise.resolve(ret[last]))
	            .then(function(data_last){
	            	if(callback){
	            		callback();
	            	}else{
		        		alert('Berhasil backup data realisasi APBD ke lokal!');
						jQuery('#wrap-loading').hide();
	            	}
	            });
			});
		}
	});
}

function get_kegiatan(id_skpd, id_sub_skpd, id_program, callback){
	var url = config.service_url+'pengeluaran/strict/dashboard/statistik-belanja/'+id_skpd+'/'+id_sub_skpd+'/'+id_program;
	relayAjaxApiKey({
		url: url,
		type: 'get',
		success: function(ret){
			update_bl_realisasi_nonactive(id_sub_skpd, 'belanja')
			.then(function(){
				var last = ret.length-1;
				ret.reduce(function(sequence, nextData){
	                return sequence.then(function(current_data){
	            		return new Promise(function(resolve_reduce, reject_reduce){
	            			pesan_loading('Get kegiatan "'+current_data.kode_giat+' '+current_data.nama_giat+'" '+current_data.kode_program+' '+current_data.nama_program);
	            			get_subgiat(current_data.id_skpd, current_data.id_sub_skpd, current_data.id_program, current_data.id_giat, function(){
	            				return resolve_reduce(nextData);
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
	            }, Promise.resolve(ret[last]))
	            .then(function(data_last){
	            	if(callback){
	            		callback();
	            	}else{
		        		alert('Berhasil backup data realisasi APBD ke lokal!');
						jQuery('#wrap-loading').hide();
	            	}
	            });
			});
		}
	});
}

function get_subgiat(id_skpd, id_sub_skpd, id_program, id_giat, callback){
	var url = config.service_url+'pengeluaran/strict/dashboard/statistik-belanja/'+id_skpd+'/'+id_sub_skpd+'/'+id_program+'/'+id_giat;
	relayAjaxApiKey({
		url: url,
		type: 'get',
		success: function(ret){
			update_bl_realisasi_nonactive(id_sub_skpd, 'belanja')
			.then(function(){
				var last = ret.length-1;
				ret.reduce(function(sequence, nextData){
	                return sequence.then(function(current_data){
	            		return new Promise(function(resolve_reduce, reject_reduce){
	            			pesan_loading('Get Sub kegiatan "'+current_data.kode_sub_giat+' '+current_data.nama_sub_giat+'" '+current_data.kode_giat+' '+current_data.nama_giat);
	            			get_realisasi(current_data, function(){
	            				return resolve_reduce(nextData);
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
	            }, Promise.resolve(ret[last]))
	            .then(function(data_last){
	            	if(callback){
	            		callback();
	            	}else{
		        		alert('Berhasil backup data realisasi APBD ke lokal!');
						jQuery('#wrap-loading').hide();
	            	}
	            });
			});
		}
	});
}

function update_bl_realisasi_nonactive(id_skpd, type){
	return new Promise(function(resolve, reject){
		pesan_loading('update_bl_realisasi_nonactive id_skpd='+id_skpd+' tipe='+type);
		var data_rak = { 
			action: 'update_bl_realisasi_nonactive',
			tahun_anggaran: _token.tahun,
			api_key: config.api_key,
			id_skpd: id_skpd,
			type: type
		};
		var data_back = {
		    message:{
		        type: "get-url",
		        content: {
				    url: config.url_server_lokal,
				    type: 'post',
				    data: data_rak,
	    			return: true
				}
		    }
		};
		if(typeof update_bl_realisasi == 'undefined'){
			window.update_bl_realisasi = {};
		}
		window.update_bl_realisasi[id_skpd] = resolve;
		chrome.runtime.sendMessage(data_back, function(response) {});
	});
}

function get_realisasi(sub, callback){	
	var id_skpd = sub.id_skpd;
	var id_sub_skpd = sub.id_sub_skpd;
	var id_urusan = sub.id_urusan;
	var id_bidang_urusan = sub.id_bidang_urusan;
	var id_program = sub.id_program;
	var id_giat = sub.id_giat;
	var id_sub_giat = sub.id_sub_giat;
	var url = config.service_url+'pengeluaran/strict/dashboard/statistik-belanja/'+id_skpd+'/'+id_sub_skpd+'/'+id_program+'/'+id_giat+'/'+id_sub_giat;
	relayAjaxApiKey({
		url: url,
		type: 'get',
		success: function(ret){
			console.log('ret', ret);
			var kode_sbl = id_skpd+'.'+id_sub_skpd+'.'+id_skpd+'.'+id_bidang_urusan+'.'+id_program+'.'+id_giat+'.'+id_sub_giat;
			var data_realisasi = { 
				action: 'singkron_realisasi_dashboard',
				tahun_anggaran: _token.tahun,
				api_key: config.api_key,
				kode_sbl: kode_sbl,
				id_skpd: id_skpd,
				type: 'belanja',
				sumber: 'ri',
				data: {}
			};
			ret.map(function(b, i){
				data_realisasi.data[i] = {}				
				data_realisasi.data[i].id_unit = b.id_skpd;
                data_realisasi.data[i].id_skpd = b.id_skpd;
                data_realisasi.data[i].id_sub_skpd = b.id_sub_skpd;
                data_realisasi.data[i].id_program = b.id_program;
                data_realisasi.data[i].id_giat = b.id_giat;
                data_realisasi.data[i].id_sub_giat = b.id_sub_giat;
                data_realisasi.data[i].id_daerah = b.id_daerah;                
                data_realisasi.data[i].id_akun = b.id_akun;
                data_realisasi.data[i].kode_akun = b.kode_akun;
				data_realisasi.data[i].nama_akun = b.nama_akun;
                data_realisasi.data[i].nilai = b.anggaran;
                data_realisasi.data[i].realisasi = b.realisasi_rill;
                data_realisasi.data[i].realisasi_rencana = b.realisasi_rencana;                
				data_realisasi.data[i].tahun = b.tahun;				
			});
			var data_back = {
			    message:{
			        type: "get-url",
			        content: {
					    url: config.url_server_lokal,
					    type: 'post',
					    data: data_realisasi,
		    			return: true
					}
			    }
			};
			if(callback){
				data_back.message.content.return = false;
			}
			chrome.runtime.sendMessage(data_back, function(response) {
			    console.log('responeMessage', response);
				if(callback){
			    	callback(data_realisasi);
			    }
			});
		}
	});
}