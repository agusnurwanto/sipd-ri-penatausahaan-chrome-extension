// function singkron_spp_lokal(type_data, search_value=false){
// 	return new Promise(function(resolve, reject){
// 		var type;
// 		if (type_data =='UP') {
// 			type = 'UP';
// 		}else if (type_data =='GU') {
// 			type = 'GU';
// 		}else if (type_data =='TU') {
// 			type = 'TU';
// 		}else if (type_data =='LS') {
// 			type = 'LS';
// 		}

// 		console.log('Get data All SPP!');
// 	})
// }

function singkron_spp_lokal() {
	jQuery('#wrap-loading').show();
    var url = config.service_url+'referensi/strict/dpa/penarikan/belanja';
	relayAjaxApiKey({
	  url: url,
	  type: "GET",
	  success: function (units) {
		var last = units.length-1;
		units.reduce(function (sequence, nextData) {
		  return sequence.then(function (current_data) {
			return new Promise(function (resolve_reduce, reject_reduce) {
			  singkron_spp_ke_lokal_skpd(current_data.id_skpd,'UP', 'draft', ()=>{
				singkron_spp_ke_lokal_skpd(current_data.id_skpd,'UP', 'diterima', ()=>{
					singkron_spp_ke_lokal_skpd(current_data.id_skpd,'UP', 'dihapus', ()=>{
						singkron_spp_ke_lokal_skpd(current_data.id_skpd,'UP', 'ditolak', ()=>{
							singkron_spp_ke_lokal_skpd(current_data.id_skpd,'GU', 'draft', ()=>{
								singkron_spp_ke_lokal_skpd(current_data.id_skpd,'GU', 'diterima',()=>{
									singkron_spp_ke_lokal_skpd(current_data.id_skpd,'GU', 'dihapus', ()=>{
										singkron_spp_ke_lokal_skpd(current_data.id_skpd,'GU', 'ditolak',()=>{
											singkron_spp_ke_lokal_skpd(current_data.id_skpd,'TU', 'draft', ()=>{
												singkron_spp_ke_lokal_skpd(current_data.id_skpd,'TU', 'diterima',()=>{
													singkron_spp_ke_lokal_skpd(current_data.id_skpd,'TU', 'dihapus', ()=>{
														singkron_spp_ke_lokal_skpd(current_data.id_skpd,'TU', 'ditolak',()=>{
															singkron_spp_ke_lokal_skpd(current_data.id_skpd,'LS', 'draft', ()=>{
																singkron_spp_ke_lokal_skpd(current_data.id_skpd,'LS', 'diterima',()=>{
																	singkron_spp_ke_lokal_skpd(current_data.id_skpd,'LS', 'dihapus', ()=>{
																		singkron_spp_ke_lokal_skpd(current_data.id_skpd,'LS', 'ditolak',()=>{
																			resolve_reduce(nextData);
																		});
																	});
																});
															});
														});
													});
												});
											});
										});
									});
								});
							});
						});
					});
				});
			  });
			}).catch(function (e) {
			  console.log(e);
			  return Promise.resolve(nextData);
			});
		  })
		  .catch(function (e) {
			console.log(e);
			return Promise.resolve(nextData);
		  });
		}, Promise.resolve(units[last]))
		.then(function (data_last) {
		  jQuery("#wrap-loading").hide();
		  alert("Berhasil singkron SPP");
		});
	  },
	});
  }

  function singkron_spp_ke_lokal_skpd(skpd, tipe, status, callback) {	
	relayAjaxApiKey({
	  url: config.service_url+'pengeluaran/strict/spp/pembuatan/index?jenis='+tipe+'&status='+status,
	  method: "GET",
	//   dataType: "JSON",
	  success: function (response) {
		var spp = {
		  action: "singkron_spp",
		  tahun_anggaran: config.tahun_anggaran,
		  api_key: config.api_key,
		  idSkpd: skpd.id_skpd,
		  tipe: tipe,
		  sumber: 'ri',
		  data: response,
		};
		var data_back = {
		  message: {
			type: "get-url",
			content: {
			  url: config.url_server_lokal,
			  type: "post",
			  data: spp,
			  return: false
			},
		  },
		};
		chrome.runtime.sendMessage(data_back, (resp) => {
		  console.log("Kirim data SPP ID SKPD="+skpd.id_skpd+" tipe="+tipe+" status="+status+". Response From Background", resp);
		});
  
		var last = response.length-1;
		response.reduce(function (sequence, nextData) {
		  return sequence.then(function (current_data) {
			return new Promise(function (resolve_reduce, reject_reduce) {
			  relayAjax({
				url: config.sipd_url + "siap/data/detail-spp/" + current_data.idSpp+ "/" + tipe,
				method: "GET",
				dataType: "JSON",
				success: function (res) {
				  if(res.length >= 1){
					var spp_detail = {
					  action: "singkron_spp_detail",
					  tahun_anggaran: config.tahun_anggaran,
					  api_key: config.api_key,
					  idSkpd: skpd.idSkpd,
					  tipe: tipe,
					  data: res,
					};
					var data_back = {
					  message: {
						type: "get-url",
						content: {
						  url: config.url_server_lokal,
						  type: "post",
						  data: spp_detail,
						  return: true
						},
					  },
					};
					chrome.runtime.sendMessage(data_back, (resp) => {
					  window.singkron_spp_detail = {
						resolve: resolve_reduce,
						nexData: nextData
					  };
					  console.log("Kirim data SPP detail ID="+current_data.idSpp+" tipe="+tipe+". Response From Background", resp);
					});
				  }else{
					console.log('SPP detail dengan idSpp='+current_data.idSpp+" tipe="+tipe+" kosong!");
					resolve_reduce(nextData);
				  }
				}
			  });
			}).catch(function (e) {
			  console.log(e);
			  return Promise.resolve(nextData);
			});
		  })
		  .catch(function (e) {
			console.log(e);
			return Promise.resolve(nextData);
		  });
		}, Promise.resolve(response[last]))
		.then(function (data_last) {
		  callback();
		});
	  },
	});
  }