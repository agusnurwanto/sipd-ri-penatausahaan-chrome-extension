function singkron_pegawai_lokal(){
    jQuery('#wrap-loading').show();
    get_pegawai({data: []})
    .then(function(pegawai_all){
		alert('Berhasil singkron Pegawai ke lokal!');
		jQuery('#wrap-loading').hide();
    })
}

function get_pegawai(opsi, page=1, limit=50){
	return new Promise(function(resolve, reject){
		pesan_loading('Get pegawai page='+page);
	    relayAjaxApiKey({
			url: config.service_url+'pegawai/strict/pegawai?page='+page+'&limit='+limit,
			type: 'get',
			success: function(data){
				get_view_skpd().then(function(skpd){
					var skpd_all = {};
					skpd.map(function(b, i){
						skpd_all[b.id_skpd] = b;
					});
					console.log('skpd_all', skpd_all);
					// jika user yang login adalah BUD
					if(
						page == 1
						&& _token.id_role == 9
					){
						data.push({
					        "id": '',
					        "id_daerah": _token.id_daerah,
					        "id_skpd": 0,
					        "id_user": _token.id_user,
					        "id_role": _token.id_role,
					        "nama_role": "BENDAHARA UMUM DAERAH",
					        "tahun_pegawai": _token.tahun,
					        "id_pegawai_kpa": 0,
					        "status": "",
					        "id_pegawai_ref": "0",
					        "id_user_kpa": 0,
					        "nama_user": "",
					        "nip_user": ""
						})
					}
					var last = data.length-1;
					data.reduce(function(sequence, nextData){
			            return sequence.then(function(current_data){
			        		return new Promise(function(resolve_reduce, reject_reduce){
			        			relayAjaxApiKey({
									url: config.service_url+'auth/strict/user-manager/'+current_data.id_user,
									type: 'get',
									success: function(user){
			        					pesan_loading('Get detail pegawai '+user.nama_user);
										current_data.detail_user = user;
										current_data.skpd = {
											'idSkpd': current_data.id_skpd,
											'namaSkpd': '',
											'kodeSkpd': '',
											'idDaerah': current_data.id_daerah
										};
										if(skpd_all[current_data.id_skpd]){
											current_data.skpd.namaSkpd = skpd_all[current_data.id_skpd].nama_skpd;
											current_data.skpd.kodeSkpd = skpd_all[current_data.id_skpd].kode_skpd;
										}
										current_data.userName = user.nip_user;
										current_data.nip = user.nip_user;
										current_data.fullName = user.nama_user;
										current_data.nomorHp = '';
										current_data.rank = '';
										current_data.npwp = user.npwp_user;
										current_data.jabatan = {
											'idJabatan': '',
											'namaJabatan': current_data.nama_role,
											'idRole': current_data.id_role,
											'order': ''
										};
										current_data.kpa = '';
										current_data.bank = '';
										current_data.group = '';
										current_data.password = '';
										current_data.konfirmasiPassword = '';
										current_data.kodeBank = '';
										current_data.nama_rekening = '';
										current_data.nomorRekening = '';
										current_data.pangkatGolongan = '';
										current_data.tahunPegawai = current_data.tahun_pegawai;
										current_data.kodeDaerah = '';
										current_data.is_from_sipd = '';
										current_data.is_from_generate = '';
										current_data.is_from_external = '';
										current_data.idSubUnit = '';
										current_data.lahir_user = user.lahir_user;
										current_data.nik = user.nik_user;
										current_data.idUser = current_data.id_user;
										current_data.idPegawai = '';
										current_data.alamat = user.alamat;
										opsi.data.push(current_data);
										resolve_reduce(nextData);
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
			        }, Promise.resolve(data[last]))
			        .then(function(data_last){
			        	var data_back = {
						    message:{
						        type: "get-url",
						        content: {
								    url: config.url_server_lokal,
								    type: 'post',
								    data: { 
										action: 'singkron_user_penatausahaan',
										tahun_anggaran: _token.tahun,
										api_key: config.api_key,
										type: 'ri',
										data_user: opsi.data
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
							get_pegawai(opsi, page, limit)
							.then(function(newdata){
								resolve(newdata);
							});
						}else{
							resolve(opsi.data);
						}
			        });
				});
			}
		});
	});
}

function singkron_panggol_lokal(){
    jQuery('#wrap-loading').show();
    get_panggol({data: []})
    .then(function(ppanggo_all){
		alert('Berhasil singkron Pangkat dan Golongan ke lokal!');
		jQuery('#wrap-loading').hide();
    })
}

function get_panggol(opsi, page=1, limit=50){
	return new Promise(function(resolve, reject){
		pesan_loading('Get Pangkat Golongan page='+page);
	    relayAjaxApiKey({
			url: config.service_url+'masterdata/panggol',
			type: 'get',
			success: function(data){
				// jika user yang login adalah BUD
				if(
					page == 1
					&& _token.id_role == 9
				){
					data.push({
				        "id": '',
				        "id_daerah": _token.id_daerah,
				        "id_skpd": 0,
				        "id_user": _token.id_user,
				        "id_role": _token.id_role,
				        "nama_role": "BENDAHARA UMUM DAERAH",
				        "tahun_pegawai": _token.tahun,
				        "id_pegawai_kpa": 0,
				        "status": "",
				        "id_pegawai_ref": "0",
				        "id_user_kpa": 0,
				        "nama_user": "",
				        "nip_user": ""
					})
				}
				var last = data.length-1;
				data.reduce(function(sequence, nextData){
		            return sequence.then(function(current_data){
		        		return new Promise(function(resolve_reduce, reject_reduce){
		        			
		        					pesan_loading('Get Pangkat Golongan '+current_data);
									
										console.log(current_data);
										current_data.id = current_data.id;
										current_data.nama_pangkat = current_data.nama_pangkat;
										current_data.nama_golongan = current_data.nama_golongan;
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
									action: 'singkron_panggol_penatausahaan',
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

					if(data.length >= limit){
						// dikosongkan lagi setelah data dikirim ke lokal
						opsi.data = [];
						page++;
						get_pegawai(opsi, page, limit)
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


function get_view_pegawai(idpegawai){    
    return new Promise(function(resolve, reject){    	
		relayAjaxApiKey({
			url: config.sipd_url+'api/master/daerah/view/'+idpegawai,                                    
			type: 'GET',	      				
			processData: false,
			contentType : 'application/json',
			// beforeSend: function (xhr) {			    
			// 	xhr.setRequestHeader("X-API-KEY", x_api_key2());
			// 	xhr.setRequestHeader("X-ACCESS-TOKEN", _token.token);  
			// },
	      	success: function(pegawai){
	      		return resolve(pegawai);
	      	}
	    });
    });
}