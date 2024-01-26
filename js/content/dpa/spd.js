// detail spd
//https://service.sipd.kemendagri.go.id/pengeluaran/strict/spd/otorisasi/list-spd/1392
//Laporan SPD
//https://service.sipd.kemendagri.go.id/pengeluaran/strict/spd/pembuatan/laporan-spd/1392/1049
function singkron_spd_lokal(){
    jQuery('#wrap-loading').show();
    var url = config.service_url+'pengeluaran/strict/spd/otorisasi';
    relayAjaxApiKey({
		url: url,
		type: 'get',
		success: function(skpd_all){
			var last = skpd_all.length-1;
			skpd_all.reduce(function(sequence, nextData){
                return sequence.then(function(current_data){
            		return new Promise(function(resolve_reduce, reject_reduce){
            			pesan_loading('Get SPD dari SKPD "'+current_data.kode_skpd+' '+current_data.nama_skpd+'"');
            			get_spd_skpd(current_data.id_skpd, function(){
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
        		alert('Berhasil singkron SPD ke lokal!');
				jQuery('#wrap-loading').hide();
            });
		}
	});
}

function get_spd_skpd(id_sub_skpd, callback){
	var url = config.service_url+'pengeluaran/strict/spd/otorisasi/list-spd/'+id_sub_skpd;
	relayAjaxApiKey({
		url: url,
		type: 'get',
		success: function(ret){
			var last = ret.items.length-1;
			ret.items.reduce(function(sequence, nextData){
                return sequence.then(function(current_data){
            		return new Promise(function(resolve_reduce, reject_reduce){
            			pesan_loading('Get Laporan SPD "'+current_data.id_skpd+' '+current_data.nomor_spd+'" '+current_data.periode_spd+' '+current_data.nilai);
            			get_spd(current_data, function(){
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
	        		alert('Berhasil singkron SPD ke lokal!');
					jQuery('#wrap-loading').hide();
            	}
            });
		}
	});
}

function get_rak(sub, callback){
	var id_daerah = sub.id_daerah;
	var id_skpd = sub.id_skpd;
	var id_spd = sub.id_spd;
	var is_otorisasi_spd = sub.is_otorisasi_spd;
	var kode_tahap = sub.kode_tahap;
	var nilai = sub.nilai;
	var nomor_spd = sub.nomor_spd;
	var periode_spd = sub.periode_spd;
	
	var url = config.service_url+'pengeluaran/strict/spd/pembuatan/laporan-spd/'+id_skpd+'/'+id_spd;
	relayAjaxApiKey({
		url: url,
		type: 'get',
		success: function(ret){
			console.log('ret', ret);
			// var kode_sbl = id_skpd+'.'+id_sub_skpd+'.'+id_skpd+'.'+id_bidang_urusan+'.'+id_program+'.'+id_giat+'.'+id_sub_giat;
			var data_spd = { 
				action: 'singkron_detail_spd',
				tahun_anggaran: _token.tahun,
				api_key: config.api_key,
				id_skpd: id_skpd,
				id_spd: id_spd,
				sumber: 'ri',
				data: {}
			};
			ret.map(function(b, i){
				data_spd.data[i] = {}
				data_spd.data[i].idSpd = id_spd;
				data_spd.data[i].id_skpd = id_skpd;
				data_spd.data[i].totalSpd = nilai;
				data_spd.data[i].nomorSpd = nomor_spd;
				data_spd.data[i].periode_spd = periode_spd;
				data_spd.data[i].keteranganSpd = b.keterangan_spd;
				data_spd.data[i].ketentuanLainnya = b.untuk_kebutuhan;

				data_spd.data[i].is_otorisasi_spd = is_otorisasi_spd;
				data_spd.data[i].kode_tahap = kode_tahap;
				

				data_spd.data[i].akumulasi_spd_sebelumnya = b.akumulasi_spd_sebelumnya;
				// data_spd.data[i].item_laporan = b.item_laporan;				
				data_spd.data[i].jabatan_bud = b.jabatan_bud;
				data_spd.data[i].jumlah_dana_dpa_skpd = b.jumlah_dana_dpa_skpd;
				data_spd.data[i].jumlah_dana_spd_saat_ini = b.jumlah_dana_spd_saat_ini;
				data_spd.data[i].jumlah_penyediaan_dana = b.jumlah_penyediaan_dana;
				data_spd.data[i].keterangan_spd = b.keterangan_spd;
				data_spd.data[i].kondisi_dpa = b.kondisi_dpa;
				data_spd.data[i].kondisi_perda = b.kondisi_perda;
				data_spd.data[i].kondisi_perkada = b.kondisi_perkada;
				data_spd.data[i].nama_bud = b.nama_bud;				
				data_spd.data[i].nama_daerah = b.nama_daerah;
				data_spd.data[i].nama_ibu_kota = b.nama_ibu_kota;
				data_spd.data[i].nama_kepala = b.nama_kepala;
				data_spd.data[i].nama_skpd = b.nama_skpd;
				data_spd.data[i].nip_bud = b.nip_bud;
				data_spd.data[i].no_perkada = b.no_perkada;
				data_spd.data[i].nomor_dpa = b.nomor_dpa;
				data_spd.data[i].nomor_perda = b.nomor_perda;
				data_spd.data[i].sisa_jumlah_dana = b.sisa_jumlah_dana;
				data_spd.data[i].tanggal_perda = b.tanggal_perda;
				data_spd.data[i].tanggal_perkada = b.tanggal_perkada;
				data_spd.data[i].tanggal_spd = b.tanggal_spd;
				data_spd.data[i].untuk_kebutuhan = b.untuk_kebutuhan;
				data_spd.data[i].akumulasi_spd_sebelumnya = b.akumulasi_spd_sebelumnya;	
				data_spd.data[i].detail_spd	= {};	
				b.item_laporan.map(function(d, c){
					data_spd.data[i].detail_spd[c]	= {};
					data_spd.data[i].detail_spd[c].id_akun	= d.id_akun;
					data_spd.data[i].detail_spd[c].kode_akun	= d.kode_akun;
					data_spd.data[i].detail_spd[c].nama_akun	= d.nama_akun;
				});			
			});
			var data_back = {
			    message:{
			        type: "get-url",
			        content: {
					    url: config.url_server_lokal,
					    type: 'post',
					    data: data_spd,
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
			    	callback(data_spd);
			    }
			});
		}
	});
}
