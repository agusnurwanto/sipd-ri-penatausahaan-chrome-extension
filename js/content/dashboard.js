function singkron_dashboard_ke_lokal(val) {    
	var type = val;
	if(type == 'belanja'){
		pesan_loading('Get data Realiasi '+type);
		singkron_belanja_dashboard_ke_lokal();
	}else if(type == 'pendapatan'){
		pesan_loading('Get data Realiasi '+type);
		singkron_pendapatan_dashboard_ke_lokal();
	}else if(type == 'pembiayaan'){
		pesan_loading('Get data Realiasi '+type);
		singkron_pembiayaan_dashboard_ke_lokal();
	}else{
		alert('Jenis data belum dipilih!');
	}
}

function singkron_belanja_dashboard_ke_lokal() {    
    jQuery('#wrap-loading').show();
	arrbulan = ["01","02","03","04","05","06","07","08","09","10","11","12"];
	date = new Date();
    millisecond = date.getMilliseconds();
    detik = date.getSeconds();
    menit = date.getMinutes();
    jam = date.getHours();
    hari = date.getDay();
    tanggal = date.getDate();
    bulan = date.getMonth();
    tahun = date.getFullYear();
	//https://service.sipd.kemendagri.go.id/pengeluaran/strict/dashboard/statistik-belanja/3253?tanggal_akhir=2024-07-25
	//https://service.sipd.kemendagri.go.id/pengeluaran/strict/dashboard/statistik-belanja?tanggal_akhir=2024-07-25
    var url = config.service_url+'pengeluaran/strict/dashboard/statistik-belanja?tanggal_akhir='+tahun+'-'+arrbulan[bulan]+'-'+tanggal;
    return new Promise(function(resolve, reduce){
	    relayAjaxApiKey({
			url: url,
			type: 'get',
			success: function(data_skpd_all){
				var last = data_skpd_all.length-1;
				data_skpd_all.reduce(function(sequence, nextData){
	                return sequence.then(function(current_data){
	            		return new Promise(function(resolve_reduce, reject_reduce){
	            			pesan_loading('Get SKPD "'+current_data.kode_skpd+' '+current_data.nama_skpd+'"');
	            			get_skpd(current_data.id_skpd, function(){
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
	        		alert('Berhasil backup data realisasi belanja APBD ke lokal!');
					jQuery('#wrap-loading').hide();
					return resolve();
	            });
			}
        });
    });
}

function singkron_pendapatan_dashboard_ke_lokal() {    
    jQuery('#wrap-loading').show();
    var url = config.service_url+'penerimaan/strict/dashboard/statistik-pendapatan';
    return new Promise(function(resolve, reduce){
	    relayAjaxApiKey({
			url: url,
			type: 'get',
			success: function(data_skpd_all){
				update_bl_realisasi_nonactive(false, 'pendapatan')
				.then(function(){
					var last = data_skpd_all.length-1;
					data_skpd_all.reduce(function(sequence, nextData){
		                return sequence.then(function(current_data){
		            		return new Promise(function(resolve_reduce, reject_reduce){
		            			pesan_loading('Get sub SKPD dari SKPD "'+current_data.kode_skpd+' '+current_data.nama_skpd+'"');
		            			get_sub_skpd_pendapatan(current_data.id_skpd, function(){
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
		        		alert('Berhasil backup data realisasi pendapatan APBD ke lokal!');
						jQuery('#wrap-loading').hide();
						return resolve();
		            });
		        });
			}
        });
    });
}

function singkron_pembiayaan_dashboard_ke_lokal() {    
    jQuery('#wrap-loading').show();
    var url = config.service_url+'pembiayaan/strict/dashboard/statistik-pembiayaan';
    return new Promise(function(resolve, reduce){
	    relayAjaxApiKey({
			url: url,
			type: 'get',
			success: function(data_skpd_all){
				update_bl_realisasi_nonactive(false, 'pembiayaan')
				.then(function(){
					var last = data_skpd_all.length-1;
					data_skpd_all.reduce(function(sequence, nextData){
		                return sequence.then(function(current_data){
		            		return new Promise(function(resolve_reduce, reject_reduce){
		            			pesan_loading('Get sub SKPD dari SKPD "'+current_data.kode_skpd+' '+current_data.nama_skpd+'"');
		            			get_sub_skpd_pembiayaan(current_data.id_skpd, function(){
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
		        		alert('Berhasil backup data realisasi pembiayaan APBD ke lokal!');
						jQuery('#wrap-loading').hide();
						return resolve();
		            });
		        });
			}
        });
    });
}

function get_skpd(id_skpd, callback){
	arrbulan = ["01","02","03","04","05","06","07","08","09","10","11","12"];
	date = new Date();
    millisecond = date.getMilliseconds();
    detik = date.getSeconds();
    menit = date.getMinutes();
    jam = date.getHours();
    hari = date.getDay();
    tanggal = date.getDate();
    bulan = date.getMonth();
    tahun = date.getFullYear();
	var url = config.service_url+'pengeluaran/strict/dashboard/statistik-belanja/'+id_skpd+'?tanggal_akhir='+tahun+'-'+arrbulan[bulan]+'-'+tanggal;
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
	            			pesan_loading('Get SUB SKPD"'+current_data.kode_sub_skpd+' '+current_data.nama_sub_skpd+'" '+current_data.realisasi_rencana+' '+current_data.realisasi_rill);
	            			get_sub_skpd(current_data.id_skpd, current_data.id_sub_skpd, function(){
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

function get_sub_skpd(id_skpd, id_sub_skpd, callback){
	arrbulan = ["01","02","03","04","05","06","07","08","09","10","11","12"];
	date = new Date();
    millisecond = date.getMilliseconds();
    detik = date.getSeconds();
    menit = date.getMinutes();
    jam = date.getHours();
    hari = date.getDay();
    tanggal = date.getDate();
    bulan = date.getMonth();
    tahun = date.getFullYear();
	var url = config.service_url+'pengeluaran/strict/dashboard/statistik-belanja/'+id_skpd+'/'+id_sub_skpd+'?tanggal_akhir='+tahun+'-'+arrbulan[bulan]+'-'+tanggal;
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
	            			get_program(current_data.id_skpd, current_data.id_sub_skpd, current_data.id_bidang_urusan, function(){
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

function get_sub_skpd_pendapatan(id_skpd, callback){
	var url = config.service_url+'penerimaan/strict/dashboard/statistik-pendapatan/'+id_skpd;
	relayAjaxApiKey({
		url: url,
		type: 'get',
		success: function(ret){
			var last = ret.length-1;
			ret.reduce(function(sequence, nextData){
                return sequence.then(function(current_data){
            		return new Promise(function(resolve_reduce, reject_reduce){
            			pesan_loading('Get realisasi pendapatan "'+current_data.kode_sub_skpd+' '+current_data.nama_sub_skpd+'"');
            			get_realisasi_pendapatan(current_data, function(){
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
		}
	});
}

function get_sub_skpd_pembiayaan(id_skpd, callback){
	var url = config.service_url+'pembiayaan/strict/dashboard/statistik-pembiayaan/'+id_skpd;
	relayAjaxApiKey({
		url: url,
		type: 'get',
		success: function(ret){
			var last = ret.length-1;
			ret.reduce(function(sequence, nextData){
                return sequence.then(function(current_data){
            		return new Promise(function(resolve_reduce, reject_reduce){
            			pesan_loading('Get realisasi pembiayaan "'+current_data.kode_sub_skpd+' '+current_data.nama_sub_skpd+'"');
            			get_realisasi_pembiayaan(current_data, function(){
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
		}
	});
}

function get_program(id_skpd, id_sub_skpd, id_bidang_urusan, callback){
	arrbulan = ["01","02","03","04","05","06","07","08","09","10","11","12"];
	date = new Date();
    millisecond = date.getMilliseconds();
    detik = date.getSeconds();
    menit = date.getMinutes();
    jam = date.getHours();
    hari = date.getDay();
    tanggal = date.getDate();
    bulan = date.getMonth();
    tahun = date.getFullYear();
	var url = config.service_url+'pengeluaran/strict/dashboard/statistik-belanja/'+id_skpd+'/'+id_sub_skpd+'/'+id_bidang_urusan+'?tanggal_akhir='+tahun+'-'+arrbulan[bulan]+'-'+tanggal;
	relayAjaxApiKey({
		url: url,
		type: 'get',
		success: function(ret){
			var last = ret.length-1;
			ret.reduce(function(sequence, nextData){
                return sequence.then(function(current_data){
            		return new Promise(function(resolve_reduce, reject_reduce){
            			pesan_loading('Get kegiatan "'+current_data.kode_program+' '+current_data.nama_program+'" '+current_data.kode_sub_skpd+' '+current_data.nama_sub_skpd);
            			get_kegiatan(current_data.id_skpd, current_data.id_sub_skpd, current_data.id_bidang_urusan, current_data.id_program, function(){
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
		}
	});
}

function get_kegiatan(id_skpd, id_sub_skpd, id_bidang_urusan, id_program, callback){
	arrbulan = ["01","02","03","04","05","06","07","08","09","10","11","12"];
	date = new Date();
    millisecond = date.getMilliseconds();
    detik = date.getSeconds();
    menit = date.getMinutes();
    jam = date.getHours();
    hari = date.getDay();
    tanggal = date.getDate();
    bulan = date.getMonth();
    tahun = date.getFullYear();
	var url = config.service_url+'pengeluaran/strict/dashboard/statistik-belanja/'+id_skpd+'/'+id_sub_skpd+'/'+id_bidang_urusan+'/'+id_program+'?tanggal_akhir='+tahun+'-'+arrbulan[bulan]+'-'+tanggal;
	relayAjaxApiKey({
		url: url,
		type: 'get',
		success: function(ret){
			var last = ret.length-1;
			ret.reduce(function(sequence, nextData){
                return sequence.then(function(current_data){
            		return new Promise(function(resolve_reduce, reject_reduce){
            			pesan_loading('Get kegiatan "'+current_data.kode_giat+' '+current_data.nama_giat+'" '+current_data.kode_program+' '+current_data.nama_program);
            			get_subgiat(current_data.id_skpd, current_data.id_sub_skpd, current_data.id_bidang_urusan, current_data.id_program, current_data.id_giat, function(){
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
		}
	});
}

function get_subgiat(id_skpd, id_sub_skpd, id_bidang_urusan, id_program, id_giat, callback){
	arrbulan = ["01","02","03","04","05","06","07","08","09","10","11","12"];
	date = new Date();
    millisecond = date.getMilliseconds();
    detik = date.getSeconds();
    menit = date.getMinutes();
    jam = date.getHours();
    hari = date.getDay();
    tanggal = date.getDate();
    bulan = date.getMonth();
    tahun = date.getFullYear();
	var url = config.service_url+'pengeluaran/strict/dashboard/statistik-belanja/'+id_skpd+'/'+id_sub_skpd+'/'+id_bidang_urusan+'/'+id_program+'/'+id_giat+'?tanggal_akhir='+tahun+'-'+arrbulan[bulan]+'-'+tanggal;
	relayAjaxApiKey({
		url: url,
		type: 'get',
		success: function(ret){
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
	arrbulan = ["01","02","03","04","05","06","07","08","09","10","11","12"];
	date = new Date();
    millisecond = date.getMilliseconds();
    detik = date.getSeconds();
    menit = date.getMinutes();
    jam = date.getHours();
    hari = date.getDay();
    tanggal = date.getDate();
    bulan = date.getMonth();
    tahun = date.getFullYear();

	var id_skpd = sub.id_skpd;
	var id_sub_skpd = sub.id_sub_skpd;
	var id_urusan = sub.id_urusan;
	var id_bidang_urusan = sub.id_bidang_urusan;
	var id_program = sub.id_program;
	var id_giat = sub.id_giat;
	var id_sub_giat = sub.id_sub_giat;
	var url = config.service_url+'pengeluaran/strict/dashboard/statistik-belanja/'+id_skpd+'/'+id_sub_skpd+'/'+id_bidang_urusan+'/'+id_program+'/'+id_giat+'/'+id_sub_giat+'?tanggal_akhir='+tahun+'-'+arrbulan[bulan]+'-'+tanggal;
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

function get_realisasi_pendapatan(sub, callback){	
	var id_skpd = sub.id_skpd;
	var id_sub_skpd = sub.id_sub_skpd;
	var id_urusan = 0;
	var id_bidang_urusan = 0;
	var id_program = 0;
	var id_giat = 0;
	var id_sub_giat = 0;
	var url = config.service_url+'penerimaan/strict/dashboard/statistik-pendapatan/'+id_skpd+'/'+id_sub_skpd;
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
				type: 'pendapatan',
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

function get_realisasi_pembiayaan(sub, callback){	
	var id_skpd = sub.id_skpd;
	var id_sub_skpd = sub.id_sub_skpd;
	var id_urusan = 0;
	var id_bidang_urusan = 0;
	var id_program = 0;
	var id_giat = 0;
	var id_sub_giat = 0;
	var url = config.service_url+'pembiayaan/strict/dashboard/statistik-pembiayaan/'+id_skpd+'/'+id_sub_skpd;
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
				type: 'pembiayaan',
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