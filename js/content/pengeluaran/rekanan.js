function singkron_rekanan_lokal(){
    jQuery('#wrap-loading').show();
    get_rekanan({data: []})
    .then(function(rekanan_all){
		alert('Berhasil singkron Rekanan ke lokal!');
		jQuery('#wrap-loading').hide();
    })
}

function get_rekanan(opsi, page=1, limit=10){
	return new Promise(function(resolve, reject){
		pesan_loading('Get rekanan page='+page);
	    relayAjaxApiKey({
			url: config.service_url+'pengeluaran/strict/rekanan?page='+page+'&limit='+limit,
			type: 'get',
			success: function(data){
					var last = data.length-1;
					data.reduce(function(sequence, nextData){
			            return sequence.then(function(current_data){
			        		return new Promise(function(resolve_reduce, reject_reduce){
			        			pesan_loading('Get rekanan '+current_data.nama_tujuan);
								opsi.data.push(current_data);
								resolve_reduce(nextData);
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
			        }, Promise.resolve(data[last]))
			        .then(function(data_last){
			        	var data_back = {
						    message:{
						        type: "get-url",
						        content: {
								    url: config.url_server_lokal,
								    type: 'post',
								    data: { 
										action: 'singkron_rekanan_sipd',
										tahun_anggaran: _token.tahun,
										api_key: config.api_key,
										type: 'ri',
										data_rekanan: opsi.data
									},
					    			return: false
								}
						    }
						};
						chrome.runtime.sendMessage(data_back, function(response) {
						    console.log('responeMessage', response);
						});

						if(data.length >= limit){
							// dikosongkan lagi setelah data dikirim ke lokal
							opsi.data = [];
							page++;
							get_rekanan(opsi, page, limit)
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

// function singkron_rekanan_lokal(){
//     jQuery('#wrap-loading').show();
//     var url = config.service_url+'pengeluaran/strict/rekanan';
//     relayAjaxApiKey({
// 		url: url,
// 		type: 'get',
// 		success: function(rekanan_all){            
//             console.log(rekanan_all);
// 			pesan_loading('Simpan data Master Rekanan ke DB Lokal!');	
//             var data = { 
//                 action: 'singkron_rekanan_sipd',
//                 type: 'ri',
//                 tahun_anggaran: _token.tahun,
//                 api_key: config.api_key,
//                 data_rekanan: {}
//             };
//             rekanan_all.map(function(b, i){
//                 data.data_rekanan[i] = {}                
//                 data.data_rekanan[i].id_daerah = b.id_daerah;
//                 data.data_rekanan[i].id_skpd = b.id_skpd;
//                 data.data_rekanan[i].nomor_rekening = b.nomor_rekening;
//                 data.data_rekanan[i].nama_rekening = b.nama_rekening;
//                 data.data_rekanan[i].id_bank = b.id_bank;
//                 data.data_rekanan[i].nama_bank = b.nama_bank;
//                 data.data_rekanan[i].cabang_bank = b.cabang_bank;
//                 data.data_rekanan[i].nama_tujuan = b.nama_tujuan;
//                 data.data_rekanan[i].nama_perusahaan = b.nama_perusahaan;
//                 data.data_rekanan[i].alamat_perusahaan = b.alamat_perusahaan;
//                 data.data_rekanan[i].telepon_perusahaan = b.telepon_perusahaan;
//                 data.data_rekanan[i].npwp = b.npwp;
//                 data.data_rekanan[i].nik = b.nik;
//                 data.data_rekanan[i].jenis_rekanan = b.jenis_rekanan;
//                 data.data_rekanan[i].kategori_rekanan = b.kategori_rekanan;
//                 data.data_rekanan[i].is_valid = b.is_valid;
//                 data.data_rekanan[i].is_locked = b.is_locked;
//                 data.data_rekanan[i].created_at = b.created_at;
//                 data.data_rekanan[i].created_by = b.created_by;
// 			});
//             var data = {
//                 message:{
//                     type: "get-url",
//                     content: {
//                         url: config.url_server_lokal,
//                         type: 'post',
//                         data: data,
//                         return: false
//                     }
//                 }
//             };
//             chrome.runtime.sendMessage(data, function(response) {
//                 console.log('responeMessage', response);
//                 // resolve_reduce(data_user);
//                 alert('Berhasil singkron Rekanan ke lokal!');
// 				jQuery('#wrap-loading').hide();
//             });
//         }
//     });
// }