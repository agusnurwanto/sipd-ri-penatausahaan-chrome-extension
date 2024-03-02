function singkron_tbp_lokal() {
	jQuery('#wrap-loading').show();
	// status = draft , diterima , dihapus , ditolak
	var status = 'aktif';
	pesan_loading('Get data TBP, status='+status);
	relayAjaxApiKey({
  		url: config.service_url+'pengeluaran/strict/tbp/index/0?limit=10000000&status='+status,
		//   url: config.service_url+'pengeluaran/strict/tbp/index/0?is_panjar=1&jenis=UP&status='+status,
	  	type: 'get',
	  	success: function (response) {
			console.log('TBP', response);
			var page_skpd = {};
			var last = response.length-1;
			response.reduce(function (sequence, nextData) {
			  	return sequence.then(function (current_data) {
					return new Promise(function (resolve_reduce, reject_reduce) {
						pesan_loading('Get TBP dari ID SKPD "'+current_data.id_skpd+'"');
						if(!page_skpd[current_data.id_skpd]){
							page_skpd[current_data.id_skpd] = [];
						}
						page_skpd[current_data.id_skpd].push(current_data);

						// melakukan reset page sesuai data per skpd
						current_data.page = page_skpd[current_data.id_skpd].length;

						singkron_tbp_ke_lokal_skpd(current_data, ()=>{
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
			  	jQuery("#wrap-loading").hide();
			  	alert("Berhasil singkron TBP");
			});
	  	},
	});
}

function singkron_tbp_ke_lokal_skpd(current_data, callback) {
	var tbp = {
	  	action: "singkron_tbp",
	  	tahun_anggaran: _token.tahun,
	  	api_key: config.api_key,
	  	idSkpd: current_data.id_skpd,
	  	jenis: current_data.jenis_tbp,
	  	sumber: 'ri',
	  	page: current_data.page,
		data: {}
	};   
	tbp.data[0] = {}
	tbp.data[0].id_tbp = current_data.id_tbp;
	tbp.data[0].id_sp2d_distribusi = current_data.id_sp2d_distribusi;
	tbp.data[0].id_sp2d = current_data.id_sp2d;
	tbp.data[0].tahun = current_data.tahun;
	tbp.data[0].id_daerah = current_data.id_daerah;
	tbp.data[0].id_unit = current_data.id_unit;
	tbp.data[0].id_skpd = current_data.id_skpd;
	tbp.data[0].id_sub_skpd = current_data.id_sub_skpd;
	tbp.data[0].nilai_tbp = current_data.nilai_tbp;
	tbp.data[0].tanggal_tbp = current_data.tanggal_tbp;
	tbp.data[0].keterangan_tbp = current_data.keterangan_tbp;
	tbp.data[0].nilai_materai_tbp = current_data.nilai_materai_tbp;
	tbp.data[0].nomor_kwitansi = current_data.nomor_kwitansi;
	tbp.data[0].id_pegawai_pa_kpa = current_data.id_pegawai_pa_kpa;
	tbp.data[0].jenis_tbp = current_data.jenis_tbp;
	tbp.data[0].jenis_ls_tbp = current_data.jenis_ls_tbp;
	tbp.data[0].is_kunci_rekening_tbp = current_data.is_kunci_rekening_tbp;
	tbp.data[0].is_panjar = current_data.is_panjar;
	tbp.data[0].is_lpj = current_data.is_lpj;
	tbp.data[0].id_lpj = current_data.id_lpj;
	tbp.data[0].id_npd = current_data.id_npd;
	tbp.data[0].is_rekanan_upload = current_data.is_rekanan_upload;
	tbp.data[0].status_aklap = current_data.status_aklap;
	tbp.data[0].nomor_jurnal = current_data.nomor_jurnal;
	tbp.data[0].jurnal_id = current_data.jurnal_id;
	tbp.data[0].metode = current_data.metode;
	tbp.data[0].id_jadwal = current_data.id_jadwal;
	tbp.data[0].id_tahap = current_data.id_tahap;
	tbp.data[0].status_tahap = current_data.status_tahap;
	tbp.data[0].kode_tahap = current_data.kode_tahap;
	tbp.data[0].created_at = current_data.created_at;
	tbp.data[0].created_by = current_data.created_by;
	tbp.data[0].kode_skpd = current_data.kode_skpd;
	tbp.data[0].nama_skpd = current_data.nama_skpd;
	tbp.data[0].kode_sub_skpd = current_data.kode_sub_skpd;
	tbp.data[0].nama_sub_skpd = current_data.nama_sub_skpd;
	tbp.data[0].total_pertanggungjawaban = current_data.total_pertanggungjawaban;
	var data_back = {
	 	 message: {
			type: "get-url",
			content: {
			  	url: config.url_server_lokal,
			  	type: "post",
			  	data: tbp,
			  	return: false
			},
	  	},
	};
	chrome.runtime.sendMessage(data_back, (resp) => {
	  	pesan_loading("Kirim data TBP ID SKPD="+current_data.id_skpd+" jenis="+current_data.jenis_tbp+" nomor="+current_data.nomor_tbp+" halaman="+current_data.page);
	});
	// if(current_data.jenis_tbp == 'UP'){
	// 	return callback();
	// }

	new Promise(function (resolve, reject) {
        jQuery.ajax({
            url: config.service_url + "pengeluaran/strict/tbp/cetak/" + current_data.id_tbp,
			type: 'get',
			dataType: "JSON",
			beforeSend: function (xhr) {			    
				xhr.setRequestHeader("Authorization", 'Bearer '+getCookie('X-SIPD-PU-TK'));
			},
            success: function (res) {
                console.log('response detail tbp', res);
				var tbp_detail = {
					action: "singkron_tbp_detail",
					tahun_anggaran: _token.tahun,
					api_key: config.api_key,
					idSkpd: current_data.id_skpd,
					id_tbp: current_data.id_tbp,
					jenis: current_data.jenis_tbp,
					sumber: 'ri',
					data: res
				};
				var data_back = {
					message: {
						type: "get-url",
						content: {
							url: config.url_server_lokal,
							type: "post",
							data: tbp_detail,
							return: false
						},
					}
				};
                chrome.runtime.sendMessage(data_back, (resp) => {
                    // window.singkron_tbp_detail = {
                    //     resolve: resolve
                    // };
                    pesan_loading("Kirim data TBP detail ID="+current_data.id_tbp);
					return callback();
                });
            },
            error: function(err){
                console.log('Error get detail TBP! id='+current_data.id_tbp, err);
                resolve();
            }
        });
    })
    .then(function () {
        callback();
    });
}