
function singkron_jurnal_lokal(){
	jQuery('#wrap-loading').show();
	var status = 'ditransfer';	
	new Promise(function(resolve, reject){		
		singkron_jurnal_lokal_per_skpd(1, [], function(response){
            console.log('SKPD', response);
			var page_skpd = {};
			var last = response.length-1;
			response.reduce(function (sequence, nextData) {
			  	return sequence.then(function (current_data) {
					return new Promise(function (resolve_reduce, reject_reduce) {
						pesan_loading('Get Buku Jurnal dari SKPD "'+current_data.nama_skpd+'"');
						if(!page_skpd[current_data.id]){
							page_skpd[current_data.id] = [];
						}
						page_skpd[current_data.id].push(current_data);

						// melakukan reset page sesuai data per skpd
						current_data.page = page_skpd[current_data.id].length;

						singkron_jurnal_ke_lokal_skpd(current_data, ()=>{
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
				return singkron_jurnal_lokal();
			});
		});
	})
	.then(function () {
	  	jQuery("#wrap-loading").hide();
	  	alert("Berhasil singkron Buku Jurnal AKLAP");
	});
}

function singkron_jurnal_lokal_per_skpd(page=1, response_all=[], cb){
    pesan_loading('Get data SKPD Buku Jurnal halaman='+page);
    relayAjaxApiKey({
        //https://service.sipd.kemendagri.go.id/aklap/api/common/skpd/get-skpd?keyword=&page=1
        url: config.service_url+'aklap/api/common/skpd/get-skpd?keyword=&page='+page,
        type: 'get',
        dataType: "JSON",
        beforeSend: function (xhr) {                
            xhr.setRequestHeader("Authorization", 'Bearer '+getCookie('X-SIPD-PU-TK'));
        },
        success: function (response) {
            console.log('SKPD Buku Jurnal', response.data.data);
            if(response.data.data!=null && response.data.data.length >= 1){
                response.data.data.map(function(b, i){
                    response_all.push(b);
                })
                singkron_jurnal_lokal_per_skpd(page+1, response_all, cb);
            }else{
                cb(response_all);
            }
        },
    });
}

function singkron_jurnal_ke_lokal_skpd(current_data, callback) {
	//https://service.sipd.kemendagri.go.id/aklap/api/buku-jurnal/list?skpd=3284&per_page=10&page=1
	var url = config.service_url + 'aklap/api/buku-jurnal/list?skpd='+current_data.id+'&per_page=10&page='+current_data.page;
    new Promise(function (resolve, reject) {
        jQuery.ajax({
            url: url,
            type: 'get',
            dataType: "JSON",
            beforeSend: function (xhr) {                
                xhr.setRequestHeader("Authorization", 'Bearer '+getCookie('X-SIPD-PU-TK'));
            },
            success: function (res) {
                console.log('response buku jurnal', res);
                var data_jurnal = { 
                    action: 'singkron_jurnal',
                    tahun_anggaran: _token.tahun,
                    api_key: config.api_key,
                    id_skpd: current_data.id_skpd,
                    sumber: 'ri',
                    page: current_data.page,
                    data: {}
                };
                // let lapjurnal = Object.keys(res.data.list);
                var i;
                for ( i = 0; i < res.data.length; i++) {
                res.data.list.map( b => { 
                    
                    //function(b, i){       
                    console.log(b);         
                    // let detail = Object.keys(b.details)
                    // console.log(b.detail);    
                    data_jurnal.data[i] = {}
                    data_jurnal.data[i].id_jurnal = b.id;
                    data_jurnal.data[i].tanggal_jurnal = b.tanggal_jurnal;
                    data_jurnal.data[i].skpd_id = b.skpd_id;		
                    data_jurnal.data[i].nama_skpd = b.nama_skpd;
                    data_jurnal.data[i].nomor_jurnal = b.nomor_jurnal;
                    data_jurnal.data[i].dokumen_sumber = b.dokumen_sumber;
                    data_jurnal.data[i].detail_jurnal	= {};	
                    console.log(b.details);
                    b.details.map(function(d, c){
                        data_jurnal.data[i].detail_jurnal[c]	= {};					               
                        data_jurnal.data[i].detail_jurnal[c].account_id	= d.account_id;
                        data_jurnal.data[i].detail_jurnal[c].id_detail	= d.id;
                        data_jurnal.data[i].detail_jurnal[c].amount = d.amount;
                        data_jurnal.data[i].detail_jurnal[c].kode_rekening	= d.kode_rekening;                        
                        data_jurnal.data[i].detail_jurnal[c].nama_rekening  = d.nama_rekening;
                        data_jurnal.data[i].detail_jurnal[c].position	= d.position;     
                    });			
                });
                }

                var data_back = {
                    message: {
                        type: "get-url",
                        content: {
                            url: config.url_server_lokal,
                            type: "post",
                            data: data_jurnal,
                            return: true
                        },
                    }
                };
                chrome.runtime.sendMessage(data_back, (resp) => {
                    window.singkron_jurnal = {
                        resolve: resolve
                    };
                    pesan_loading("Kirim data Buku Jurnal ID="+current_data.id);
                });
            },
            error: function(err){
                console.log('Error get detail SP2D! id='+current_data.id, err);
                resolve();
            }
        });
    })
    .then(function () {
        callback();
    });
}