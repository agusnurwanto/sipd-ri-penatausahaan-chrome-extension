function singkron_rekanan_lokal(){
    jQuery('#wrap-loading').show();
    get_rekanan({data: []})
    .then(function(rekanan_all){
		alert('Berhasil singkron Rekanan ke lokal!');
		jQuery('#wrap-loading').hide();
    })
}

function get_rekanan(opsi, page=1, limit=20){
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