function singkron_stbp_lokal(status=['belum_verifikasi', 'sudah_verifikasi', 'sudah_otorisasi', 'sudah_validasi', 'dihapus']) {
	jQuery('#wrap-loading').show();
    var type_status = status;
    new Promise(function(resolve, reject){
        if(typeof type_status == 'undefined'){
            return resolve();
        }
        pesan_loading('Get data STBP status='+type_status);
    	relayAjaxApiKey({			
            url: config.service_url+'penerimaan/strict/stbp?jenis=ALL&status='+type_status,
            type: 'get',
            success: function (response) {
        		console.log('STBP', response);
        		var page_skpd = {};
                var last = response.length-1;
                response.reduce(function (sequence, nextData) {
                    return sequence.then(function (current_data) {
                        return new Promise(function (resolve_reduce, reject_reduce) {
							console.log('STBP', current_data);
                            pesan_loading('Get STBP '+type_status+' dari ID SKPD "'+current_data.id_skpd+'"');
                            if(!page_skpd[current_data.id_skpd]){
                                page_skpd[current_data.id_skpd] = [];
                            }
                            page_skpd[current_data.id_skpd].push(current_data);

                            // melakukan reset page sesuai data per skpd
                            current_data.page = page_skpd[current_data.id_skpd].length;

        					singkron_stbp_ke_lokal_skpd(current_data, type_status, ()=>{
                                resolve_reduce(nextData);
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
        		}, Promise.resolve(response[last]))
        		.then(function (data_last) {
        		    return singkron_stbp_lokal(data);
        		});
            },
    	});
    })
    .then(function () {
        jQuery("#wrap-loading").hide();
        alert("Berhasil singkron STBP");
    });
}


function singkron_stbp_ke_lokal_skpd(current_data, status, callback) {
    var stbp = {
        action: "singkron_stbp",
        tahun_anggaran: _token.tahun,
        api_key: config.api_key,
        idSkpd: current_data.id_skpd,        
        sumber: 'ri',
        page: current_data.page,
        data: {}
    };

    stbp.data[0] = {}
    stbp.data[0].id_stbp = current_data.id_stbp;
    stbp.data[0].nomor_stbp = current_data.nomor_stbp;
    stbp.data[0].no_rekening = current_data.no_rekening;
    stbp.data[0].metode_penyetoran = current_data.metode_penyetoran;    
    stbp.data[0].keterangan_stbp = current_data.keterangan_stbp;
    stbp.data[0].is_verifikasi_stbp = current_data.is_verifikasi_stbp;
	stbp.data[0].is_otorisasi_stbp = current_data.is_otorisasi_stbp;
	stbp.data[0].is_validasi_stbp = current_data.is_validasi_stbp;
	stbp.data[0].tanggal_stbp = current_data.tanggal_stbp;
	stbp.data[0].tahun_anggaran = current_data.tahun;    
    stbp.data[0].id_daerah = current_data.id_daerah;
    stbp.data[0].id_unit = current_data.id_unit;
    stbp.data[0].id_skpd = current_data.id_skpd;
    stbp.data[0].id_sub_skpd = current_data.id_sub_skpd;    
    stbp.data[0].is_sts = current_data.is_sts;    
    stbp.data[0].created_at = current_data.created_at;
    
    var data_back = {
        message: {
            type: "get-url",
            content: {
                url: config.url_server_lokal,
                type: "post",
                data: stbp,
                return: false
            },
        },
    };
    chrome.runtime.sendMessage(data_back, (resp) => {
        pesan_loading("Kirim data STBP ID SKPD="+current_data.id_skpd+" status="+status+" keterangan = "+current_data.keterangan_stbp);
    });

    new Promise(function (resolve, reject) {
        jQuery.ajax({
            url: config.service_url + "penerimaan/strict/stbp/cetak/" + current_data.id_stbp,
            type: 'get',
            dataType: "JSON",
            beforeSend: function (xhr) {                
                xhr.setRequestHeader("Authorization", 'Bearer '+getCookie('X-SIPD-PU-TK'));
            },
            success: function (res) {
                console.log('response detail stbp', res);
                var stbp_detail = {
                    action: "singkron_stbp_detail",
                    tahun_anggaran: _token.tahun,
                    api_key: config.api_key,
                    idSkpd: current_data.id_skpd,
                    id_stbp: current_data.id_stbp,
                    sumber: 'ri',
                    data: res[res]
                };
                var data_back = {
                    message: {
                        type: "get-url",
                        content: {
                            url: config.url_server_lokal,
                            type: "post",
                            data: stbp_detail,
                            return: true
                        },
                    }
                };
                chrome.runtime.sendMessage(data_back, (resp) => {
                    window.singkron_stbp_detail = {
                        resolve: resolve
                    };
                    pesan_loading("Kirim data STBP detail ID="+current_data.id_stbp+" status="+status);
                });
            },
            error: function(err){
                console.log('Error get detail STBP! id='+current_data.id_stbp, err);
                resolve();
            }
        });
    })
    .then(function () {
        callback();
    });
}        