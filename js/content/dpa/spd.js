function singkron_spd_lokal(){	
    jQuery('#wrap-loading').show();
	var url = config.service_url+'pengeluaran/strict/spd/otorisasi';
	relayAjaxApiKey({
		url: url,
		type: 'get',
		success: function(skpd){
			console.log('skpd', skpd);			
			var data_spd = { 
				action: 'singkron_spd',
				tahun_anggaran: _token.tahun,
				api_key: config.api_key,
				kode_sbl: kode_sbl,
				id_skpd: id_skpd,
				type: 'belanja',
				sumber: 'ri',
				data: {}
			};
			skpd.map(function(b, i){
				data_spd.data[i] = {}				
				data_rak.data[i].bulan_12 = b[12];
				data_rak.data[i].id_skpd = b.id_skpd;
				data_rak.data[i].kode_skpd = b.kode_skpd;
				data_rak.data[i].id_daerah = b.id_daerah;
				data_rak.data[i].nama_skpd = b.nama_skpd;
				data_rak.data[i].status = b.status;
				data_rak.data[i].tahun = b.tahun;
				data_rak.data[i].totalSpd = b.nilai;
				data_rak.data[i].nilai_rak = b.nilai_rak;
			});
			var data_back = {
			    message:{
			        type: "get-url",
			        content: {
					    url: config.url_server_lokal,
					    type: 'post',
					    data: data_spd,
		    			return: true
					}
			    }
			};
			if(callback){
				data_back.message.content.return = false;
			}
			chrome.runtime.sendMessage(data_back, function(response) {
			    console.log('responeMessage', response);
				if(callback){
			    	callback(data_spd);
			    }
			});
		}
	});
}