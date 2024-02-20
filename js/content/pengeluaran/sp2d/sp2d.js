function singkron_sp2d_lokal(){
	jQuery('#wrap-loading').show();
	pesan_loading('Get data SKPD!');
	var url = config.service_url+'referensi/strict/skpd/list/'+config.id_daerah+'/'+_token.tahun;
	relayAjaxApiKey({
	  	url: url,
	  	type: 'get',
	  	success: function (units) {
			console.log('units', units);
			var last = units.length-1;
			units.reduce(function (sequence, nextData) {
			  	return sequence.then(function (current_data) {
					return new Promise(function (resolve_reduce, reject_reduce) {
						pesan_loading('Get SP2D dari SKPD "'+current_data.kode_skpd+' '+current_data.nama_skpd+'"');
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
			}, Promise.resolve(units[last]))
			.then(function (data_last) {
			  jQuery("#wrap-loading").hide();
			  alert("Berhasil singkron SP2D");
			});
	  	},
	});
}