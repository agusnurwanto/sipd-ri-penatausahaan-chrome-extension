function singkron_jurnal_aklap_ke_lokal(){	
	var skpd_all = [];
	jQuery('#table_skpd tbody input[type="checkbox"]').map(function(i, b){
		if(jQuery(b).is(':checked')){
			var tr = jQuery(b).closest('tr');
			skpd_all.push({
				id_skpd: jQuery(b).val(),
				kode_skpd: tr.find('td').eq(1).text(),
				nama_skpd: tr.find('td').eq(2).text()
			});
		}
	});
	if(skpd_all.length == 0){
		return alert('Pilih SKPD dulu!');
	}
	if(confirm('Apakah anda yakin melakukan backup data Jurnal AKLAP? Data lokal akan diupdate sesuai data terbaru.')){						
	    jQuery('#wrap-loading').show();
		var last = skpd_all.length-1;
        var page=1;
        var limit=10;
        var opsi = {data: []};
		skpd_all.reduce(function(sequence, nextData){
	        return sequence.then(function(current_data){
	    		return new Promise(function(resolve_reduce, reject_reduce){
	    			pesan_loading('Get Jurnal dari SKPD "'+current_data.kode_skpd+' '+current_data.nama_skpd+'"');
	    			get_jurnal(current_data.id_skpd, page, limit, function(){
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
	    }, Promise.resolve(skpd_all[last]))
	    .then(function(data_last){
			alert('Berhasil singkron Jurnal AKLAP ke lokal!');
			jQuery('#wrap-loading').hide();
			run_script('hide_modal');
	    });
	}	
}

function singkron_jurnal_lokal(){
    jQuery('#wrap-loading').show();
    get_jurnal({data: []})
    .then(function(jurnal_all){
		alert('Berhasil singkron Buku Jurnal ke lokal!');
		jQuery('#wrap-loading').hide();
    })
}
function get_jurnal(id_skpd, page, limit, callback){
    pesan_loading('Get data Jurnal, skpd='+id_skpd+', page='+page);
    var url = config.service_url+'aklap/api/buku-jurnal/list?skpd='+id_skpd+'&per_page='+limit+'&page='+page;
    relayAjaxApiKey({
		url: url,
		type: 'GET',
		success: function(data){
			console.log('data', data.data.list);
            console.log('last', data.data.length);
            var last = data.data.length-1;
			var jurnal = { 
                action: 'singkron_jurnal',
                tahun_anggaran: _token.tahun,
                api_key: config.api_key,                    
                id_skpd: id_skpd,
                sumber: 'ri',
                data: {},
                page: page,
            };
            
            data.data.list.map( function(b, i){
                jurnal.data[i] = {}	
                console.log('Jurnal', b); 
                jurnal.data[i].id_skpd = id_skpd;
                jurnal.data[i].id_jurnal = b.id;
                jurnal.data[i].tanggal_jurnal = b.tanggal_jurnal;
                jurnal.data[i].skpd_id = b.skpd_id;
                jurnal.data[i].nama_skpd = b.nama_skpd;
                jurnal.data[i].nomor_jurnal = b.nomor_jurnal;
                jurnal.data[i].dokumen_sumber = b.dokumen_sumber;
                console.log('detail Jurnal', b.details); 
                jurnal.data[i].detail_jurnal	= {};
                b.details.map(function(d, c){
                    console.log('detail D', d); 
                    jurnal.data[0].detail_jurnal[c]	= {};					   
                    jurnal.data[0].detail_jurnal[c].id_jurnal	= b.id;          
                    jurnal.data[0].detail_jurnal[c].account_id	= d.account_id;
                    jurnal.data[0].detail_jurnal[c].id_detail	= d.id;
                    jurnal.data[0].detail_jurnal[c].amount = d.amount;
                    jurnal.data[0].detail_jurnal[c].kode_rekening	= d.kode_rekening;                        
                    jurnal.data[0].detail_jurnal[c].nama_rekening  = d.nama_rekening;
                    jurnal.data[0].detail_jurnal[c].position	= d.position;     
                });		
            });
            var data_back = {
			    message:{
			        type: "get-url",
			        content: {
					    url: config.url_server_lokal,
					    type: 'post',
					    data: jurnal,
		    			return: false
					}
                    // return: false
			    }
			};
            if(data.data.pagination.current_page >= data.data.pagination.max_page)
            {
                data_back.message.content.return = true;
                // resolve(jurnal);                
                alert('Berhasil singkron Jurnal AKLAP ke lokal!');
                jQuery('#wrap-loading').hide();
                run_script('hide_modal');
                return;
            }
            else
            {
                if(callback){
                    data_back.message.content.return = false;
                }
                chrome.runtime.sendMessage(data_back, function(response) {
                    console.log('responeMessage', response);
                    // if(callback){
                    // 	callback(jurnal);
                    // }                
                    if(data.data.length >= limit){
                        // dikosongkan lagi setelah data dikirim ke lokal
                        // opsi.data = [];
                        page++;
                        get_jurnal(id_skpd, page, limit)
                        .then(function(newdata){
                            resolve(newdata);
                        });
                    }else{
                        // resolve(opsi.data);
                            callback(jurnal);
                    }
                });
            }
			
            // if(data.data.length >= limit){
            //     // dikosongkan lagi setelah data dikirim ke lokal
            //     opsi.data = [];
            //     page++;
            //     get_jurnal(opsi, page, limit)
            //     .then(function(newdata){
            //         resolve(newdata);
            //     });
            // }else{
            //     resolve(opsi.data);
            // }
		}
	});
}

function get_jurnal1(id_skpd, page, limit){
    // console.log('id_skpd', id_skpd);
	return new Promise(function(resolve, reject){
		pesan_loading('Get Jurnal page='+page);
	    relayAjaxApiKey({
            url: config.service_url+'aklap/api/buku-jurnal/list?skpd='+id_skpd+'&per_page='+limit+'&page='+page,
			type: 'get',
			success: function(data){
                console.log('data', data.data.list);
                console.log('last', data.data.length);
                var last = data.data.length-1;
                data.data.list.reduce(function(sequence, nextData){
                    return sequence.then(function(current_data){
                        return new Promise(function(resolve_reduce, reject_reduce){
                            // console.log('current_data', current_data);
                            var jurnal = { 
                                action: 'singkron_jurnal',
                                tahun_anggaran: _token.tahun,
                                api_key: config.api_key,                    
                                id_skpd: id_skpd,
                                sumber: 'ri',
                                data: {},
                                page: page,
                            };
                            // data.data.list.map( function(b, i){   
                            console.log('data current_data', current_data.id); 				
                            // jurnal.data[i] = {}			
                            jurnal.data[0] = {}	
                            jurnal.data[0].id_skpd = id_skpd;
                            jurnal.data[0].id_jurnal = current_data.id;
                            jurnal.data[0].tanggal_jurnal = current_data.tanggal_jurnal;
                            jurnal.data[0].skpd_id = current_data.skpd_id;
                            jurnal.data[0].nama_skpd = current_data.nama_skpd;
                            jurnal.data[0].nomor_jurnal = current_data.nomor_jurnal;
                            jurnal.data[0].dokumen_sumber = current_data.dokumen_sumber;
                            console.log('detail Jurnal', current_data.details); 
                            jurnal.data[0].detail_jurnal	= {};
                            current_data.details.map(function(d, c){
                                console.log('detail D', d); 
                                jurnal.data[0].detail_jurnal[c]	= {};					   
                                jurnal.data[0].detail_jurnal[c].id_jurnal	= current_data.id;          
                                jurnal.data[0].detail_jurnal[c].account_id	= d.account_id;
                                jurnal.data[0].detail_jurnal[c].id_detail	= d.id;
                                jurnal.data[0].detail_jurnal[c].amount = d.amount;
                                jurnal.data[0].detail_jurnal[c].kode_rekening	= d.kode_rekening;                        
                                jurnal.data[0].detail_jurnal[c].nama_rekening  = d.nama_rekening;
                                jurnal.data[0].detail_jurnal[c].position	= d.position;     
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
                }, Promise.resolve(data.data.list[last]))
                .then(function(data_last){
                    var data_back = {
                        message:{
                            type: "get-url",
                            content: {
                                url: config.url_server_lokal,
                                type: 'post',
                                data: { 
                                    action: 'singkron_jurnal',
                                    tahun_anggaran: _token.tahun,
                                    api_key: config.api_key,                    
                                    id_skpd: id_skpd,
                                    data: jurnal
                                },
                                return: false
                            }
                        }
                    };
                    if(!callback){
                        data_back.message.content.return = false;
                    }else{
                        window.get_jurnal = callback;
                    }
                    
                    if(data.data.length >= limit){
                        // dikosongkan lagi setelah data dikirim ke lokal
                        jurnal.data = [];
                        page++;
                        get_jurnal(jurnal, id_skpd, page, limit)
                        .then(function(newdata){
                            resolve(newdata);
                        });
                    }else{
                        resolve(jurnal.data);
                    }
                });
                // pesan_loading('data Jurnal', current_data);
                // var jurnal = { 
                //     action: 'singkron_jurnal',
                //     tahun_anggaran: _token.tahun,
                //     api_key: config.api_key,                    
                //     id_skpd: id_skpd,
                //     sumber: 'ri',
                //     data: {},
                //     page: page,
                // };
                // data.data.list.map( function(b, i){   
                //     console.log('data Jurnal', b); 				
                //     jurnal.data[i] = {}				
                //     jurnal.data[i].id_skpd = id_skpd;
                //     jurnal.data[i].id_jurnal = b.id;
                //     jurnal.data[i].tanggal_jurnal = b.tanggal_jurnal;
                //     jurnal.data[i].skpd_id = b.skpd_id;
                //     jurnal.data[i].nama_skpd = b.nama_skpd;
                //     jurnal.data[i].nomor_jurnal = b.nomor_jurnal;
                //     jurnal.data[i].dokumen_sumber = b.dokumen_sumber;
                //     console.log('detail Jurnal', b.details); 
                //     jurnal.data[i].detail_jurnal	= {};
                //     b.details.map(function(d, c){
                //         jurnal.data[i].detail_jurnal[c]	= {};					               
                //         jurnal.data[i].detail_jurnal[c].id_jurnal	= b.id_jurnal;
                //         jurnal.data[i].detail_jurnal[c].account_id	= d.account_id;
                //         jurnal.data[i].detail_jurnal[c].id_detail	= d.id;
                //         jurnal.data[i].detail_jurnal[c].amount = d.amount;
                //         jurnal.data[i].detail_jurnal[c].kode_rekening	= d.kode_rekening;                        
                //         jurnal.data[i].detail_jurnal[c].nama_rekening  = d.nama_rekening;
                //         jurnal.data[i].detail_jurnal[c].position	= d.position;     
                //     });		
                // });
                // var data_back = {
                //     message:{
                //         type: "get-url",
                //         content: {
                //             url: config.url_server_lokal,
                //             type: 'post',
                //             data: jurnal,
                //             return: false
                //         }
                //     }
                // };
                // if(callback){
                //     data_back.message.content.return = false;
                // }
                // chrome.runtime.sendMessage(data_back, function(response) {
                //     console.log('responeMessage', response);
                //     if(callback){
                //         callback(jurnal);
                //     }
                // });
                // if(data.data.length >= limit){
                //     // dikosongkan lagi setelah data dikirim ke lokal
                //     opsi.data = [];
                //     page++;
                //     get_jurnal(opsi, id_skpd, page, limit)
                //     .then(function(newdata){
                //         resolve(newdata);
                //     });
                // }else{
                //     resolve(opsi.data);
                // }
            }
        }); 
	});
}