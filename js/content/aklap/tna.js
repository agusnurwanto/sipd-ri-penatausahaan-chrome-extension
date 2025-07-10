function singkron_rekening_tna_ke_lokal(){	
    var data_rekening = [
			{
			  jenis_transaksi: "list-uang-muka",
			  nama_transaksi: "List Rekening Uang Muka",
			  last_url: "aklap/api/common/account/list-uang-muka?page="
			},
			{
				jenis_transaksi: "list-persediaan",
				nama_transaksi: "List Rekening Persediaan",
				last_url: "aklap/api/common/account/list-persediaan?page="
			},
			{
				jenis_transaksi: "beban-skenario-hibah",
				nama_transaksi: "List Rekening Beban Hibah",
				last_url: "aklap/api/common/account/beban-skenario-hibah?page="
			},
			{
				jenis_transaksi: "list-investasi-jangka-panjang",
				nama_transaksi: "List Rekening Investasi Jangka Panjang",
				last_url: "aklap/api/common/account/list-investasi-jangka-panjang?page="
			},
			{
				jenis_transaksi: "list-aset-lainnya",
				nama_transaksi: "List Rekening Aset Lainnya",
				last_url: "aklap/api/common/account/list-aset-lainnya?page="
			}
		];

		// Ada Bug  - hanya reduce data rekening sekali
		//          - muncul popup setelah selesai kirim ke lokal
		// Data List Rekening dengan jumlah pagination banyak
		// 	{
		// 	  jenis_transaksi: "list-pendapatan-daerah",
		// 	  nama_transaksi: "List Rekening Pendapatan Daerah",
		// 	  last_url: "aklap/api/common/account/list-pendapatan-daerah?page="
		// 	},
		// ,
		// 	{
		// 	  jenis_transaksi: "rekening-aset-diserahkan",
		// 	  nama_transaksi: "Liat Rekening Aset yang Diserahkan",
		// 	  last_url: "aklap/api/common/account/aset?page="
		// 	},
		// {
		// 	jenis_transaksi: "rekening-pendapatan-daerah",
		// 	nama_transaksi: "List Rekening Pendatapan Daerah",
		// 	last_url: "aklap/api/common/account/list-pendapatan-daerah?page="
		// }

    if(confirm('Apakah anda yakin melakukan backup data rekening transaksi non anggaran? Data lokal akan diupdate sesuai data terbaru.')){
        jQuery('#wrap-loading').show();
		var last = data_rekening.length-1;
		var page=1;
		data_rekening.reduce(function(sequence, nextData){
	        return sequence.then(function(current_data){
	    		return new Promise(function(resolve_reduce, reject_reduce){
	    			pesan_loading('Get Data Rekening "'+current_data.nama_transaksi+'"');
	    			return get_data_rekening_tna(current_data.last_url, current_data.jenis_transaksi, current_data.nama_transaksi, page, function(){
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
	    }, Promise.resolve(data_rekening[last]))
	    .then(function(data_last){
			alert('Berhasil singkron rekening transaksi non anggaran ke lokal!');
			jQuery('#wrap-loading').hide();
			run_script('hide_modal');
	    });
    }
}

function get_data_rekening_tna(last_url, jenis_transaksi, nama_transaksi, page, callback, all_data = [], total_all = 0){
	return new Promise((resolveParent, rejectParent) => {
		if(page == 1){
			pesan_loading('Get data Rekening '+nama_transaksi+', page='+page);
		}else{
			pesan_loading('Get data Rekening '+nama_transaksi+', page='+page+', all_page='+Math.ceil(total_all/10)+', total data = '+all_data.length+' / '+total_all);
		}
		
		var url = config.service_url+last_url+page;

		relayAjaxApiKey({
			url: url,
			type: 'GET',
			success: function(resp){
				console.log('data', resp.data.data);
				console.log('jenis_tna', jenis_transaksi);
				console.log('totall', resp.data.total);
				var data_rekening_tna = { 
					action: 'singkron_rekening_tna',
					tahun_anggaran: _token.tahun,
					api_key: config.api_key,
					sumber: 'ri',
					data: {},
					page: page
				};
				
				resp.data.data.map( function(b, i){
					all_data.push(b);
					
					data_rekening_tna.data[i] = {
						kode_akun: b.code,
						id_akun: b.id,
						nama_akun: b.name
					};
				});
	
				new Promise(function(resolveSendMsg, rejectSendMsg){
					if(jQuery.isEmptyObject(data_rekening_tna.data) == false){
						var data_back = {
							message:{
								type: "get-url",
								content: {
									url: config.url_server_lokal,
									type: 'post',
									data: data_rekening_tna,
									return: true
								},
							}
						};
						chrome.runtime.sendMessage(data_back, function(response) {
							if (chrome.runtime.lastError) {
								console.error('Error mengirim ke extension:', chrome.runtime.lastError.message);
								rejectSendMsg(chrome.runtime.lastError);
								return;
							}
	
							console.log('responeMessage', response);
							if(typeof window.singkron_rekening_tna == 'undefined'){
								window.singkron_rekening_tna = {};
							}
	
							window.singkron_rekening_tna[jenis_transaksi] = {
								resolve: resolveSendMsg
							};
							resolveSendMsg();
						}); 
					}else{
						resolveSendMsg(); 
					}
				})
				.then(function(){
					console.log('totall_all_data', all_data);
					if(all_data.length < resp.data.total){
						get_data_rekening_tna(last_url, jenis_transaksi, nama_transaksi, page+1, callback, all_data, resp.data.total)
						.then(resolveParent)
						.catch(rejectParent);
					}else{
						resolveParent();
						// callback();
					}
				})
				.catch(error => {
					console.log("Error saat mengirim data lokal: ", error);
					rejectParent();
				});
			},
			error: function(xhr, status, error){
				console.error("Error fetching data dari API: ", error);
				rejectParent();
			}
		});
	});
}