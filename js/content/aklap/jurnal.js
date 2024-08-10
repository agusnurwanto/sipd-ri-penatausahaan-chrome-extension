function singkron_jurnal_lokal(){
    jQuery('#wrap-loading').show();
    get_jurnal({data: []})
    .then(function(jurnal_all){
		alert('Berhasil singkron Buku Jurnal ke lokal!');
		jQuery('#wrap-loading').hide();
    })
}

function get_jurnal(opsi, page=1, limit=10){
	return new Promise(function(resolve, reject){
		pesan_loading('Get Buku Jurnal page='+page);
	    relayAjaxApiKey({
            url: config.service_url+'aklap/api/common/skpd/get-skpd?keyword=&page='+page,
			// url: config.service_url+'pegawai/strict/pegawai?page='+page+'&limit='+limit,
			type: 'get',
            dataType: "JSON",
            beforeSend: function (xhr) {                
                xhr.setRequestHeader("Authorization", 'Bearer '+getCookie('X-SIPD-PU-TK'));
            },
			success: function(data){    
                console.log('SKPD Buku Jurnal', data.data.data);
				var last = data.data.length-1;
				data.data.data.reduce(function(sequence, nextData){
		            return sequence.then(function(current_data){
		        		return new Promise(function(resolve_reduce, reject_reduce){
		        			pesan_loading('Get SKPD '+current_data.nama_skpd);
							console.log(current_data);
                            relayAjaxApiKey({
                                url: config.service_url+'aklap/api/buku-jurnal/list?skpd='+current_data.id+'&per_page='+limit+'&page='+page,
                                type: 'get',
                                dataType: "JSON",
                                beforeSend: function (xhr) {                
                                    xhr.setRequestHeader("Authorization", 'Bearer '+getCookie('X-SIPD-PU-TK'));
                                },
                                success: function(jurnal){
                                    pesan_loading('Get Jurnal '+jurnal.data.list);
                                    console.log(jurnal.data.list);
                                    var last = jurnal.data.length-1;
                                    var data = { 
                                        action: 'singkron_jurnal',
                                        type: 'ri',
                                        tahun_anggaran: _token.tahun,
                                        api_key: config.api_key,
                                        id_skpd: current_data.id,
                                        sumber: 'ri',
                                        data_jurnal: {}
                                    };
                                        jurnal.data.list.map(function(b, i){
                                        data.data_jurnal[i] = {}
                                        data.data_jurnal[i].id_jurnal = b.id;
                                        data.data_jurnal[i].tanggal_jurnal = b.tanggal_jurnal;
                                        data.data_jurnal[i].skpd_id = b.skpd_id;
                                        data.data_jurnal[i].nama_skpd = b.nama_skpd;
                                        data.data_jurnal[i].nomor_jurnal = b.nomor_jurnal;
                                        data.data_jurnal[i].dokumen_sumber = b.dokumen_sumber;
                                        data.data_jurnal[i].detail_jurnal	= {};	
                                        console.log(b.details);
                                        b.details.map(function(d, c){
                                            data.data_jurnal[i].detail_jurnal[c]	= {};					               
                                            data.data_jurnal[i].detail_jurnal[c].account_id	= d.account_id;
                                            data.data_jurnal[i].detail_jurnal[c].id_detail	= d.id;
                                            data.data_jurnal[i].detail_jurnal[c].amount = d.amount;
                                            data.data_jurnal[i].detail_jurnal[c].kode_rekening	= d.kode_rekening;                        
                                            data.data_jurnal[i].detail_jurnal[c].nama_rekening  = d.nama_rekening;
                                            data.data_jurnal[i].detail_jurnal[c].position	= d.position;     
                                        });	
                                    });
                                    var data = {
                                        message:{
                                            type: "get-url",
                                            content: {
                                                url: config.url_server_lokal,
                                                type: 'post',
                                                data: data,
                                                return: false
                                            }
                                        }
                                    };
                                    chrome.runtime.sendMessage(data, function(response) {
                                        console.log('responeMessage', response);
                                        // resolve_reduce(data_user);
                                        alert('Berhasil singkron User ke lokal!');
                                        jQuery('#wrap-loading').hide();
                                    });
                                    // current_data.detail_user = user;
                                    // current_data.skpd = {
                                    //     'idSkpd': current_data.id_skpd,
                                    //     'namaSkpd': '',
                                    //     'kodeSkpd': '',
                                    //     'idDaerah': current_data.id_daerah
                                    // };
                                    // if(skpd_all[current_data.id_skpd]){
                                    //     current_data.skpd.namaSkpd = skpd_all[current_data.id_skpd].nama_skpd;
                                    //     current_data.skpd.kodeSkpd = skpd_all[current_data.id_skpd].kode_skpd;
                                    // }
                                    // current_data.userName = user.nip_user;
                                    // current_data.nip = user.nip_user;
                                    // current_data.fullName = user.nama_user;
                                    // current_data.nomorHp = '';
                                    // current_data.rank = '';
                                    // current_data.npwp = user.npwp_user;
                                    // current_data.jabatan = {
                                    //     'idJabatan': '',
                                    //     'namaJabatan': current_data.nama_role,
                                    //     'idRole': current_data.id_role,
                                    //     'order': ''
                                    // };
                                    // current_data.kpa = '';
                                    // current_data.bank = '';
                                    // current_data.group = '';
                                    // current_data.password = '';
                                    // current_data.konfirmasiPassword = '';
                                    // current_data.kodeBank = '';
                                    // current_data.nama_rekening = '';
                                    // current_data.nomorRekening = '';
                                    // current_data.pangkatGolongan = '';
                                    // current_data.tahunPegawai = current_data.tahun_pegawai;
                                    // current_data.kodeDaerah = '';
                                    // current_data.is_from_sipd = '';
                                    // current_data.is_from_generate = '';
                                    // current_data.is_from_external = '';
                                    // current_data.idSubUnit = '';
                                    // current_data.lahir_user = user.lahir_user;
                                    // current_data.nik = user.nik_user;
                                    // current_data.idUser = current_data.id_user;
                                    // current_data.idPegawai = '';
                                    // current_data.alamat = user.alamat;
                                    // opsi.data.push(current_data);
                                    resolve_reduce(nextData);
                                }
                            });
							// current_data.id = current_data.id;
							// current_data.nama_pangkat = current_data.nama_pangkat;
							// current_data.nama_golongan = current_data.nama_golongan;
							// opsi.data.push(current_data);
							// resolve_reduce(nextData);
								
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
		        }, Promise.resolve(data.data.data[last]))
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

					if(data.data.length >= limit){
						// dikosongkan lagi setelah data dikirim ke lokal
						opsi.data = [];
						page++;
						get_jurnal(opsi, page, limit)
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

function get_view_skpd(){    
    return new Promise(function(resolve, reject){    	
		relayAjaxApiKey({
			url: config.service_url+'referensi/strict/skpd/list/'+_token.id_daerah+'/'+_token.tahun,                                    
			type: 'GET',
	      	success: function(skpd){
	      		return resolve(skpd);
	      	}
	    });
    });
}