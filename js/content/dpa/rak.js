function singkron_rak_ke_lokal(){
    jQuery('#wrap-loading').show();
    var url = config.service_url+'referensi/strict/dpa/penarikan/belanja';
    relayAjaxApiKey({
		url: url,
		type: 'get',
		success: function(skpd_all){
			var last = skpd_all.length-1;
			skpd_all.reduce(function(sequence, nextData){
                return sequence.then(function(current_data){
            		return new Promise(function(resolve_reduce, reject_reduce){
            			pesan_loading('Get sub kegiatan dari SKPD "'+current_data.kode_skpd+' '+current_data.nama_skpd+'"');
            			get_sub_keg(current_data.id_skpd, function(){
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
        		alert('Berhasil singkron RAK ke lokal!');
				jQuery('#wrap-loading').hide();
            });
		}
	});
}

function get_sub_keg(id_sub_skpd, callback){
	var url = config.service_url+'referensi/strict/dpa/penarikan/belanja/skpd/'+id_sub_skpd;
	relayAjaxApiKey({
		url: url,
		type: 'get',
		success: function(ret){
			var last = ret.items.length-1;
			ret.items.reduce(function(sequence, nextData){
                return sequence.then(function(current_data){
            		return new Promise(function(resolve_reduce, reject_reduce){
            			pesan_loading('Get RAK sub kegiatan "'+current_data.kode_sub_giat+' '+current_data.nama_sub_giat+'" '+current_data.kode_sub_skpd+' '+current_data.nama_sub_skpd);
            			get_rak(current_data, function(){
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
            }, Promise.resolve(ret.items[last]))
            .then(function(data_last){
            	if(callback){
            		callback();
            	}else{
	        		alert('Berhasil singkron RAK ke lokal!');
					jQuery('#wrap-loading').hide();
            	}
            });
		}
	});
}

function get_rak(sub, callback){
	var id_unit = sub.id_unit;
	var id_skpd = sub.id_skpd;
	var id_sub_skpd = sub.id_sub_skpd;
	var id_urusan = sub.id_urusan;
	var id_bidang_urusan = sub.id_bidang_urusan;
	var id_program = sub.id_program;
	var id_giat = sub.id_giat;
	var id_sub_giat = sub.id_sub_giat;
	var url = config.service_url+'referensi/strict/dpa/penarikan/belanja/sub-giat?id_unit='+id_unit+'&id_skpd='+id_skpd+'&id_sub_skpd='+id_sub_skpd+'&id_urusan='+id_urusan+'&id_bidang_urusan='+id_bidang_urusan+'&id_program='+id_program+'&id_giat='+id_giat+'&id_sub_giat='+id_sub_giat;
	relayAjaxApiKey({
		url: url,
		type: 'get',
		success: function(ret){
			console.log('ret', ret);
			var kode_sbl = id_skpd+'.'+id_sub_skpd+'.'+id_skpd+'.'+id_bidang_urusan+'.'+id_program+'.'+id_giat+'.'+id_sub_giat;
			var data_rak = { 
				action: 'singkron_anggaran_kas',
				tahun_anggaran: _token.tahun,
				api_key: config.api_key,
				kode_sbl: kode_sbl,
				id_skpd: id_skpd,
				type: 'belanja',
				sumber: 'ri',
				data: {}
			};
			ret.map(function(b, i){
				data_rak.data[i] = {}
				data_rak.data[i].bulan_1 = b[1];
				data_rak.data[i].bulan_2 = b[2];
				data_rak.data[i].bulan_3 = b[3];
				data_rak.data[i].bulan_4 = b[4];
				data_rak.data[i].bulan_5 = b[5];
				data_rak.data[i].bulan_6 = b[6];
				data_rak.data[i].bulan_7 = b[7];
				data_rak.data[i].bulan_8 = b[8];
				data_rak.data[i].bulan_9 = b[9];
				data_rak.data[i].bulan_10 = b[10];
				data_rak.data[i].bulan_11 = b[11];
				data_rak.data[i].bulan_12 = b[12];
				data_rak.data[i].id_akun = b.id_akun;
				data_rak.data[i].id_bidang_urusan = b.id_bidang_urusan;
				data_rak.data[i].id_daerah = b.id_daerah;
				data_rak.data[i].id_giat = b.id_giat;
				data_rak.data[i].id_program = b.id_program;
				data_rak.data[i].id_skpd = b.id_skpd;
				data_rak.data[i].id_sub_giat = b.id_sub_giat;
				data_rak.data[i].id_sub_skpd = b.id_sub_skpd;
				data_rak.data[i].id_unit = b.id_unit;
				data_rak.data[i].kode_akun = b.kode_akun;
				data_rak.data[i].nama_akun = b.nama_akun;
				data_rak.data[i].selisih = b.selisih;
				data_rak.data[i].tahun = b.tahun;
				data_rak.data[i].total_akb = b.nilai;
				data_rak.data[i].total_rincian = b.nilai_rak;
			});
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
			if(callback){
				data_back.message.content.return = false;
			}
			chrome.runtime.sendMessage(data_back, function(response) {
			    console.log('responeMessage', response);
				if(callback){
			    	callback(data_rak);
			    }
			});
		}
	});
}