function singkron_rekening_penerimaan_lokal(type_data) {
	jQuery('#wrap-loading').show();
	//https://service.sipd.kemendagri.go.id/referensi/strict/skpd/list/89/2024
	var url = config.service_url+'referensi/strict/skpd/list/'+config.api_key+'/'+_token.tahun;
    relayAjaxApiKey({
		url: url,
		type: 'get',
		success: function(skpd_all){
			var last = skpd_all.length-1;
			skpd_all.reduce(function(sequence, nextData){
                return sequence.then(function(current_data){
            		return new Promise(function(resolve_reduce, reject_reduce){
            			pesan_loading('Get Rekening Penerimaan dari SKPD "'+current_data.kode_skpd+' '+current_data.nama_skpd+'"');
            			get_rekening_skpd(current_data.id_skpd, function(){
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
        		alert('Berhasil singkron Rekening Penerimaan ke lokal!');
				jQuery('#wrap-loading').hide();
            });
		}
	});
}

function get_rekening_skpd(id_skpd, callback){

}