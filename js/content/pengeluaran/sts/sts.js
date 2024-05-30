function singkron_sts_lokal(status=['belum_validasi', 'sudah_validasi', 'sudah_pengesahan', 'dihapus']) {
	jQuery('#wrap-loading').show();
    get_view_skpd().then(function(all_skpd){
        var type_status = status.shift();
        new Promise(function(resolve, reject){
            if(typeof type_status == 'undefined'){
                return resolve();
            }
            var response_sts = [];
            var last = all_skpd.length-1;
            all_skpd.reduce(function(sequence, nextData){
                return sequence.then(function (current_data) {
                    return new Promise(function (resolve_reduce, reject_reduce) {
                        singkron_sts_lokal_per_jenis(current_data, type_status, 1, [], function(res){
                            res.map(function(b, i){
                                response_sts.push(b);
                            });
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
            }, Promise.resolve(all_skpd[last]))
            .then(function(){
                console.log('response_sts', response_sts);
        		var page_skpd = {};
                var last = response_sts.length-1;
                response_sts.reduce(function (sequence, nextData) {
                    return sequence.then(function (current_data) {
                        return new Promise(function (resolve_reduce, reject_reduce) {
    						console.log('STS', current_data);
                            pesan_loading('Get STS '+type_status+' dari ID SKPD "'+current_data.id_skpd+'"');
                            if(!page_skpd[current_data.id_skpd]){
                                page_skpd[current_data.id_skpd] = [];
                            }
                            page_skpd[current_data.id_skpd].push(current_data);

                            // melakukan reset page sesuai data per skpd
                            current_data.page = page_skpd[current_data.id_skpd].length;

        					singkron_sts_ke_lokal_skpd(current_data, type_status, function(){
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
        		}, Promise.resolve(response_sts[last]))
        		.then(function (data_last) {
        		    return singkron_sts_lokal(status);
        		});
            });
        })
        .then(function () {
            jQuery("#wrap-loading").hide();
            alert("Berhasil singkron STS");
        });
    });
}

function singkron_sts_lokal_per_jenis(data_skpd, status, page=1, response_all=[], cb){
    pesan_loading('Get data STS ID SKPD='+data_skpd.kode_skpd+' '+data_skpd.nama_skpd+' , status='+status+', halaman='+page);
    relayAjaxApiKey({
        url: config.service_url+'pengeluaran/strict/sts/index/'+data_skpd.id_skpd+'?jenis=TU&tab='+status+'&type=ALL&page='+page,
        type: 'get',
        success: function (response) {
            console.log('STS', response);
            if(response!=null && response.length >= 1){
                response.map(function(b, i){
                    response_all.push(b);
                })
                singkron_sts_lokal_per_jenis(data_skpd, status, page+1, response_all, cb);
            }else{
                cb(response_all);
            }
        },
    });
}

function singkron_sts_ke_lokal_skpd(current_data, status, callback) {
    var sts = {
        action: "singkron_sts",
        tahun_anggaran: _token.tahun,
        api_key: config.api_key,
        idSkpd: current_data.id_skpd,        
        sumber: 'ri',        
        page: current_data.page,
        data: {}
    };

    sts.data[0] = {}
    sts.data[0].id_sts = current_data.id_sts;
    sts.data[0].nomor_sts = current_data.nomor_sts;
    sts.data[0].no_rekening = current_data.no_rekening;
    sts.data[0].metode_penyetoran = current_data.metode_penyetoran;    
    sts.data[0].keterangan_sts = current_data.keterangan_sts;
    sts.data[0].is_verifikasi_sts = current_data.is_verifikasi_sts;
	sts.data[0].is_otorisasi_sts = current_data.is_otorisasi_sts;
	sts.data[0].is_validasi_sts = current_data.is_validasi_sts;
	sts.data[0].tanggal_sts = current_data.tanggal_sts;
	sts.data[0].tahun_anggaran = current_data.tahun;    
    sts.data[0].id_daerah = current_data.id_daerah;
    sts.data[0].id_unit = current_data.id_unit;
    sts.data[0].id_skpd = current_data.id_skpd;
    sts.data[0].id_sub_skpd = current_data.id_sub_skpd;    
    sts.data[0].is_sts = current_data.is_sts;    
    sts.data[0].status = status;    
    sts.data[0].created_at = current_data.created_at;
    
    var data_back = {
        message: {
            type: "get-url",
            content: {
                url: config.url_server_lokal,
                type: "post",
                data: sts,
                return: false
            },
        },
    };
    chrome.runtime.sendMessage(data_back, (resp) => {
        pesan_loading("Kirim data STS ID SKPD="+current_data.id_skpd+" status="+status+" keterangan = "+current_data.keterangan_sts);
    });

    new Promise(function (resolve, reject) {
        jQuery.ajax({
            url: config.service_url + "pengeluaran/strict/sts/cetak/" + current_data.id_sts,
            type: 'get',
            dataType: "JSON",
            beforeSend: function (xhr) {                
                xhr.setRequestHeader("Authorization", 'Bearer '+getCookie('X-SIPD-PU-TK'));
            },
            success: function (res) {
                console.log('response detail STS', res);
                var sts_detail = {
                    action: "singkron_sts_detail",
                    tahun_anggaran: _token.tahun,
                    api_key: config.api_key,
                    idSkpd: current_data.id_skpd,
                    id_sts: current_data.id_sts,
                    sumber: 'ri',
                    data: res[res]
                };
                var data_back = {
                    message: {
                        type: "get-url",
                        content: {
                            url: config.url_server_lokal,
                            type: "post",
                            data: sts_detail,
                            return: true
                        },
                    }
                };
                chrome.runtime.sendMessage(data_back, (resp) => {
                    window.singkron_sts_detail = {
                        resolve: resolve
                    };
                    pesan_loading("Kirim data STS detail ID="+current_data.id_sts+" status="+status);
                });
            },
            error: function(err){
                console.log('Error get detail STS! id='+current_data.id_sts, err);
                resolve();
            }
        });
    })
    .then(function () {
        callback();
    });
}    