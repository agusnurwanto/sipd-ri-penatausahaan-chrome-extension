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
		skpd_all.reduce(function(sequence, nextData){
	        return sequence.then(function(current_data){
	    		return new Promise(function(resolve_reduce, reject_reduce){
	    			pesan_loading('Get Jurnal dari SKPD "'+current_data.kode_skpd+' '+current_data.nama_skpd+'"');
	    			get_jurnal(current_data.id_skpd, page, function(){
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

function get_jurnal(id_skpd, page, callback, all_data = [], total_all = 0){
    var tgl_mulai = jQuery('#tgl_mulai').val();
    var tgl_akhir = jQuery('#tgl_akhir').val();

    if(page == 1){
        pesan_loading('Get data Jurnal, skpd='+id_skpd+', page='+page);
    }else{
        pesan_loading('Get data Jurnal, skpd='+id_skpd+', page='+page+', all_page='+Math.ceil(total_all/10)+', total data = '+all_data.length+' / '+total_all);
    }
    var url = config.service_url+'aklap/api/buku-jurnal/list?skpd='+id_skpd+'&per_page=10&page='+page;
    relayAjaxApiKey({
		url: url,
		type: 'GET',
		success: function(data){
			console.log('data', data.data.list);
			var jurnal = { 
                action: 'singkron_jurnal',
                tahun_anggaran: _token.tahun,
                api_key: config.api_key,                    
                id_skpd: id_skpd,
                sumber: 'ri',
                data: {},
                page: page
            };
            if(jQuery('#reset_tanggal').is(':checked') == true){
                jurnal.page += 2; // disable reset active data, karena jika page 1 kolom aktive dibuat 0
            }
            
            data.data.list.map( function(b, i){
                all_data.push(b);
                if(b.details.length >= 1){
                    if(cekTanggalDalamRange(b.tanggal_jurnal, tgl_mulai, tgl_akhir)){
                        jurnal.data[i] = {};
                        jurnal.data[i].id_skpd = id_skpd;
                        jurnal.data[i].id_jurnal = b.id;
                        jurnal.data[i].tanggal_jurnal = b.tanggal_jurnal;
                        jurnal.data[i].skpd_id = b.skpd_id;
                        jurnal.data[i].nama_skpd = b.nama_skpd;
                        jurnal.data[i].nomor_jurnal = b.nomor_jurnal;
                        jurnal.data[i].dokumen_sumber = b.dokumen_sumber;
                        jurnal.data[i].detail_jurnal	= {};
                        b.details.map(function(d, c){
                            jurnal.data[0].detail_jurnal[c]	= {};					   
                            jurnal.data[0].detail_jurnal[c].id_jurnal	= b.id;          
                            jurnal.data[0].detail_jurnal[c].account_id	= d.account_id;
                            jurnal.data[0].detail_jurnal[c].id_detail	= d.id;
                            jurnal.data[0].detail_jurnal[c].amount = d.amount;
                            jurnal.data[0].detail_jurnal[c].kode_rekening	= d.kode_rekening;                        
                            jurnal.data[0].detail_jurnal[c].nama_rekening  = d.nama_rekening;
                            jurnal.data[0].detail_jurnal[c].position	= d.position;     
                        });
                    }
                }
                else
                {
                    if(cekTanggalDalamRange(b.tanggal_jurnal, tgl_mulai, tgl_akhir)){
                        jurnal.data[i] = {};
                        jurnal.data[i].id_skpd = id_skpd;
                        jurnal.data[i].id_jurnal = b.id;
                        jurnal.data[i].tanggal_jurnal = b.tanggal_jurnal;
                        jurnal.data[i].skpd_id = b.skpd_id;
                        jurnal.data[i].nama_skpd = b.nama_skpd;
                        jurnal.data[i].nomor_jurnal = b.nomor_jurnal;
                        jurnal.data[i].dokumen_sumber = b.dokumen_sumber;
                        jurnal.data[i].detail_jurnal	= {};                        
                    }
                }

            });
            new Promise(function(resolve, reject){
                if(jQuery.isEmptyObject(jurnal.data) == false){
                    var data_back = {
        			    message:{
        			        type: "get-url",
        			        content: {
        					    url: config.url_server_lokal,
        					    type: 'post',
        					    data: jurnal,
        		    		    return: true
        					},
        			    }
        			};
                    chrome.runtime.sendMessage(data_back, function(response) {
                        console.log('responeMessage', response);
                        if(typeof singkron_jurnal == 'undefined'){
                            window.singkron_jurnal = {};
                        }

                        window.singkron_jurnal[id_skpd] = {
                            resolve: resolve
                        };
                    });
                }else{
                    resolve();
                }
            })
            .then(function(){
                if(all_data.length < data.data.total){
                    get_jurnal(id_skpd, page+1, callback, all_data, data.data.total);
                }else{
                    callback();
                }
            });
		}
	});
}