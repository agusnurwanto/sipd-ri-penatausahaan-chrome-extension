function singkron_lra_aklap_ke_lokal(){
    jQuery('#wrap-loading').show();
    var url = config.service_url+'referensi/strict/skpd/list/'+config.api_key+'/'+_token.tahun;
    relayAjaxApiKey({
		url: url,
		type: 'get',
		success: function(skpd_all){
			var last = skpd_all.length-1;
			skpd_all.reduce(function(sequence, nextData){
                return sequence.then(function(current_data){
            		return new Promise(function(resolve_reduce, reject_reduce){
            			pesan_loading('Get LRA dari SKPD "'+current_data.kode_skpd+' '+current_data.nama_skpd+'"');
            			get_lra(current_data.id_skpd, function(){
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
        		alert('Berhasil singkron LRA AKLAP ke lokal!');
				jQuery('#wrap-loading').hide();
            });
		}
	});
}

function get_lra(id_skpd, callback){
	console.log('id_skpd', id_skpd);	
	date = new Date();
    millisecond = date.getMilliseconds();
    detik = date.getSeconds();
    menit = date.getMinutes();
    jam = date.getHours();
    hari = date.getDay();
    tanggal = date.getDate();
    bulan = date.getMonth();
    tahun = date.getFullYear();
    var url = config.service_url+'aklap/api/report/cetaklra?searchparams={"tanggalFrom":"'+tahun+'-01-01","tanggalTo":"'+tahun+'-'+bulan+'-'+tanggal+'","formatFile":"json","tahun":"2021","level":6,"previewLaporan":null,"is_combine":"skpd","skpd":'+id_skpd+'}';
	relayAjaxApiKey({
		url: url,
		type: 'GET',
		success: function(ret){
			console.log('ret', ret.data);
			var lra = { 
				action: 'singkron_aklap_lra',
				tahun_anggaran: _token.tahun,
				api_key: config.api_key,
                id_daerah: ret.skpd.id_daerah,
				id_skpd: id_skpd,
				sumber: 'ri',
				data: {}
			};
            // let lapspd = Object.keys(ret)
            
			ret.data.map( function(b, i){    				
				lra.data[i] = {}				
				lra.data[i].id_skpd = id_skpd;						
				lra.data[i].kode_rekening = b.kode_rekening;
				lra.data[i].level = b.level;
				lra.data[i].nama_rekening = b.nama_rekening;
				lra.data[i].nominal = b.nominal;
				lra.data[i].presentase = b.presentase;
                lra.data[i].previous_realisasi = b.previous_realisasi;
                lra.data[i].realisasi = b.realisasi;
			});
			var data_back = {
			    message:{
			        type: "get-url",
			        content: {
					    url: config.url_server_lokal,
					    type: 'post',
					    data: lra,
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
			    	callback(lra);
			    }
			});
		}
	});
}