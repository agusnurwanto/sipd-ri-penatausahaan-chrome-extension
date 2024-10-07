function singkron_lra_aklap_ke_lokal_modal(opsi, page=1, limit=10){
	show_loading();	
	window.skpd_all = {};
	var body = '';
	relayAjaxApiKey({
		url: config.service_url+'aklap/api/common/skpd/get-skpd?keyword=&page='+page,
		type: 'get',
        dataType: "JSON",
        beforeSend: function (xhr) {                
            xhr.setRequestHeader("Authorization", 'Bearer '+getCookie('X-SIPD-PU-TK'));
        },	
		success: function(data){
			console.log('SKPD', data.data.data);
		
			window.data_all_skpd = {};
			var no = 0;
			var l1=0;
			var l2=0;
			var html_skpd = '';
			var last = data.data.length-1;
			data.data.data.map(function(b, i){
				console.log('SKPD i', b);
				var id_skpd = b.id+''+b.nama_skpd;				
				// data_all_skpd.detail.push(b);
				no++;
					html_skpd += ''
						+'<tr>'
							+'<td class="text-center">'+no+'</td>'
							+'<td class="text-center"><input type="checkbox" value="'+b.id+'"></td>'
							+'<td>'+b.nama_skpd+'</td>'
						+'</tr>';
				l1++;
			});
			pesan_loading('data_all_skpd = '+l1);
			jQuery('#modal-extension .modal-title .info-title').html('( Jumlah Semua Data: '+l1+')');
			jQuery('#table_skpd tbody').html(html_skpd);
			run_script('show_modal_sm', {order: [[1, "asc"]]});			
			hide_loading();
		}
	});
}

function pilih_skpd_lra(){
	jQuery('#wrap-loading').show();
	get_view_skpd().then(function(skpd_all){
		var html = '';
		skpd_all.map(function(b, i) {
			html += ''
			+'<tr>'
				+'<td class="text-center"><input type="checkbox" value="'+b.id_skpd+'"></td>'
				+'<td class="text-center">'+b.kode_skpd+'</td>'
				+'<td>'+b.nama_skpd+'</td>'
			+'</tr>';
		});
		jQuery('#table_skpd tbody').html(html);
		run_script('show_modal_sm', {order: [[1, "asc"]]});
		jQuery('#wrap-loading').hide();
	});
}

function singkron_lra_aklap_ke_lokal(){
	var tgl_awal = jQuery('#tgl_mulai').val();
	var tgl_akhir = jQuery('#tgl_akhir').val();
	if(tgl_awal == '' || tgl_akhir == ''){
		return alert('Tanggal Belum dipilih !!!');
	}
	var skpd_all = [];
	jQuery('#table_skpd tbody input[type="checkbox"]').map(function(i, b){
		if(jQuery(b).is(':checked')){
			var tr = jQuery(b).closest('tr');
			skpd_all.push({
				id_skpd: jQuery(b).val(),
				kode_skpd: tr.find('td').eq(1).text(),
				nama_skpd: tr.find('td').eq(2).text()
			});
		}
	});
	if(skpd_all.length == 0){
		return alert('Pilih SKPD dulu!');
	}
	if(confirm('Apakah anda yakin melakukan backup data LRA AKLAP? Data lokal akan diupdate sesuai data terbaru.')){						
	    jQuery('#wrap-loading').show();
		var last = skpd_all.length-1;
		skpd_all.reduce(function(sequence, nextData){
	        return sequence.then(function(current_data){
	    		return new Promise(function(resolve_reduce, reject_reduce){
	    			pesan_loading('Get LRA dari SKPD "'+current_data.kode_skpd+' '+current_data.nama_skpd+'"');
	    			get_lra(current_data.id_skpd, tgl_awal, tgl_akhir,  function(){
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
			alert('Berhasil singkron LRA AKLAP ke lokal!');
			jQuery('#wrap-loading').hide();
			run_script('hide_modal');
	    });
	}	
}

function get_lra(id_skpd, tgl_awal, tgl_akhir, callback){
	console.log('id_skpd', id_skpd, tgl_awal, tgl_akhir);
	awal = tgl_awal;
	akhir = tgl_akhir;
	arrbulan = ["01","02","03","04","05","06","07","08","09","10","11","12"];
	date = new Date();
    millisecond = date.getMilliseconds();
    detik = date.getSeconds();
    menit = date.getMinutes();
    jam = date.getHours();
    hari = date.getDay();
    tanggal = date.getDate();
    bulan = date.getMonth();
    tahun = date.getFullYear();
	//PerSKPD
	// var url = config.service_url+'aklap/api/report/cetaklra?searchparams={"tanggalFrom":"'+awal+'","tanggalTo":"'+akhir+'","formatFile":"json","tahun":"2021","level":null,"previewLaporan":null,"is_combine":"skpd","skpd":'+id_skpd+'}';
	//SKPD dan unit
	// var url = config.service_url+'aklap/api/report/cetaklra?searchparams={"tanggalFrom":"'+awal+'","tanggalTo":"'+akhir+'","formatFile":"json","tahun":"2021","level":null,"previewLaporan":null,"is_combine":"skpd_unit","skpd":'+id_skpd+'}';
	//SKPD dan unit Konsolidasi
	// var url = config.service_url+'aklap/api/report/cetaklra?searchparams={"tanggalFrom":"'+awal+'","tanggalTo":"'+akhir+'","formatFile":"json","tahun":"2021","level":null,"previewLaporan":null,"is_combine":"skpd_mandiri","skpd":'+id_skpd+'}';
    var url = config.service_url+'aklap/api/report/cetaklra?searchparams={"tanggalFrom":"'+awal+'","tanggalTo":"'+akhir+'","formatFile":"json","tahun":"2021","level":6,"previewLaporan":null,"is_combine":"skpd","skpd":'+id_skpd+'}';
	relayAjaxApiKey({
		url: url,
		type: 'GET',
		success: function(ret){
			var lra = { 
				action: 'singkron_aklap_lra',
				tahun_anggaran: _token.tahun,
				api_key: config.api_key,
                id_daerah: ret.skpd.id_daerah,
				id_skpd: id_skpd,
				mulai_tgl: awal,
				sampai_tgl: akhir,
				sumber: 'ri',
				page: 0,
				data: []
			};
            
            var all_data = [];
            var current_data = [];
            var per_page = 50;
			ret.data.map( function(b, i){    				
				var new_data = {}				
				new_data.id_skpd = id_skpd;						
				new_data.kode_rekening = b.kode_rekening;
				new_data.level = b.level;
				new_data.nama_rekening = b.nama_rekening;
				new_data.nominal = b.nominal;
				new_data.presentase = b.presentase;
                new_data.previous_realisasi = b.previous_realisasi;
                new_data.realisasi = b.realisasi;
                current_data.push(new_data);
                if(current_data.length >= per_page){
                	all_data.push(current_data);
                	current_data = [];
                }
			});
			if(current_data.length >= 1){
				all_data.push(current_data);
			}
			console.log('all_data', all_data);
			var last = all_data.length-1;
			all_data.reduce(function(sequence, nextData){
		        return sequence.then(function(current_data){
		    		return new Promise(function(resolve_reduce, reject_reduce){
		    			lra.data = current_data;
		    			lra.page += 1;

		    			pesan_loading('Kirim LRA ke lokal ID SKPD '+id_skpd+', page '+lra.page+' dari '+all_data.length);
						var data_back = {
						    message:{
						        type: "get-url",
						        content: {
								    url: config.url_server_lokal,
								    type: 'post',
								    data: lra,
					    			return: true
								}
						    }
						};
						chrome.runtime.sendMessage(data_back, function(response) {
						    console.log('responeMessage', response);
						    if(typeof singkron_aklap_lra == 'undefined'){
			                    window.singkron_aklap_lra = {};
			                }

			                window.singkron_aklap_lra[id_skpd] = {
			                    resolve: resolve_reduce,
			                    nextData: nextData
			                };
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
		    }, Promise.resolve(all_data[last]))
		    .then(function(data_last){
                if(callback){
			    	callback(lra);
			    }
		    });
		}
	});
}