function singkron_sp2d_lokal(data=['UP', 'LS', 'GU', 'TU']){
	jQuery('#wrap-loading').show();
	var status = 'ditransfer';
	var type_data = data.shift();
	new Promise(function(resolve, reject){
		if(typeof type_data == 'undefined'){
			return resolve();
		}
		pesan_loading('Get data SP2D jenis='+type_data+' , status='+status);
		var url = config.service_url+'pengeluaran/strict/sp2d/pembuatan/index?jenis='+type_data+'&status='+status;
		relayAjaxApiKey({
		  	url: url,
		  	type: 'get',
		  	success: function (response) {
				console.log('SP2D', response);
				var page_skpd = {};
				var last = response.length-1;
				response.reduce(function (sequence, nextData) {
				  	return sequence.then(function (current_data) {
						return new Promise(function (resolve_reduce, reject_reduce) {
							pesan_loading('Get SP2D '+type_data+' dari ID SKPD "'+current_data.id_skpd+'"');
							if(!page_skpd[current_data.id_skpd]){
								page_skpd[current_data.id_skpd] = [];
							}
							page_skpd[current_data.id_skpd].push(current_data);

							// melakukan reset page sesuai data per skpd
							current_data.page = page_skpd[current_data.id_skpd].length;

							singkron_sp2d_ke_lokal_skpd(current_data, type_data, status, ()=>{
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
					return singkron_sp2d_lokal(data);
				});
		  	},
		});
	})
	.then(function () {
	  	jQuery("#wrap-loading").hide();
	  	alert("Berhasil singkron SP2D");
	});
}

function singkron_sp2d_ke_lokal_skpd(current_data, tipe, status, callback) {
	var sp2d = {
	  	action: "singkron_sp2d",
	  	tahun_anggaran: _token.tahun,
	  	api_key: config.api_key,
	  	idSkpd: current_data.id_skpd,
	  	tipe: tipe,
	  	sumber: 'ri',
	  	page: current_data.page,
	 	data: {}
	};
	sp2d.data[0] = {};
	sp2d.data[0].bulan_gaji = current_data.bulan_gaji;
	sp2d.data[0].bulan_tpp = current_data.bulan_tpp;
	sp2d.data[0].created_at = current_data.created_at;
	sp2d.data[0].created_by = current_data.created_by;
	sp2d.data[0].deleted_at = current_data.deleted_at;
	sp2d.data[0].deleted_by = current_data.deleted_by;
	sp2d.data[0].id_bank = current_data.id_bank;
	sp2d.data[0].id_daerah = current_data.id_daerah;
	sp2d.data[0].id_jadwal = current_data.id_jadwal;
	sp2d.data[0].id_pegawai_bud_kbud = current_data.id_pegawai_bud_kbud;
	sp2d.data[0].id_rkud = current_data.id_rkud;
	sp2d.data[0].id_skpd = current_data.id_skpd;
	sp2d.data[0].id_sp_2_d = current_data.id_sp_2_d;
	sp2d.data[0].id_spm = current_data.id_spm;
	sp2d.data[0].id_sub_skpd = current_data.id_sub_skpd;
	sp2d.data[0].id_sumber_dana = current_data.id_sumber_dana;
	sp2d.data[0].id_tahap = current_data.id_tahap;
	sp2d.data[0].id_unit = current_data.id_unit;
	sp2d.data[0].is_gaji = current_data.is_gaji;
	sp2d.data[0].is_kunci_rekening_sp_2_d = current_data.is_kunci_rekening_sp_2_d;
	sp2d.data[0].is_pelimpahan = current_data.is_pelimpahan;
	sp2d.data[0].is_status_perubahan = current_data.is_status_perubahan;
	sp2d.data[0].is_tpp = current_data.is_tpp;
	sp2d.data[0].is_transfer_sp_2_d = current_data.is_transfer_sp_2_d;
	sp2d.data[0].is_verifikasi_sp_2_d = current_data.is_verifikasi_sp_2_d;
	sp2d.data[0].jenis_gaji = current_data.jenis_gaji;
	sp2d.data[0].jenis_ls_sp_2_d = current_data.jenis_ls_sp_2_d;
	sp2d.data[0].jenis_rkud = current_data.jenis_rkud;
	sp2d.data[0].jenis_sp_2_d = current_data.jenis_sp_2_d;
	sp2d.data[0].jurnal_id = current_data.jurnal_id;
	sp2d.data[0].keterangan_sp_2_d = current_data.keterangan_sp_2_d;
	sp2d.data[0].keterangan_transfer_sp_2_d = current_data.keterangan_transfer_sp_2_d;
	sp2d.data[0].keterangan_verifikasi_sp_2_d = current_data.keterangan_verifikasi_sp_2_d;
	sp2d.data[0].kode_skpd = current_data.kode_skpd;
	sp2d.data[0].kode_sub_skpd = current_data.kode_sub_skpd;
	sp2d.data[0].kode_tahap = current_data.kode_tahap;
	sp2d.data[0].metode = current_data.metode;
	sp2d.data[0].nama_bank = current_data.nama_bank;
	sp2d.data[0].nama_bud_kbud = current_data.nama_bud_kbud;
	sp2d.data[0].nama_rek_bp_bpp = current_data.nama_rek_bp_bpp;
	sp2d.data[0].nama_skpd = current_data.nama_skpd;
	sp2d.data[0].nama_sub_skpd = current_data.nama_sub_skpd;
	sp2d.data[0].nilai_materai_sp_2_d = current_data.nilai_materai_sp_2_d;
	sp2d.data[0].nilai_sp_2_d = current_data.nilai_sp_2_d;
	sp2d.data[0].nip_bud_kbud = current_data.nip_bud_kbud;
	sp2d.data[0].no_rek_bp_bpp = current_data.no_rek_bp_bpp;
	sp2d.data[0].nomor_jurnal = current_data.nomor_jurnal;
	sp2d.data[0].nomor_sp_2_d = current_data.nomor_sp_2_d;
	sp2d.data[0].nomor_spm = current_data.nomor_spm;
	sp2d.data[0].status_aklap = current_data.status_aklap;
	sp2d.data[0].status_perubahan_at = current_data.status_perubahan_at;
	sp2d.data[0].status_perubahan_by = current_data.status_perubahan_by;
	sp2d.data[0].status_tahap = current_data.status_tahap;
	sp2d.data[0].tahun = current_data.tahun;
	sp2d.data[0].tahun_gaji = current_data.tahun_gaji;
	sp2d.data[0].tahun_tpp = current_data.tahun_tpp;
	sp2d.data[0].tanggal_sp_2_d = current_data.tanggal_sp_2_d;
	sp2d.data[0].tanggal_spm = current_data.tanggal_spm;
	sp2d.data[0].transfer_sp_2_d_at = current_data.transfer_sp_2_d_at;
	sp2d.data[0].transfer_sp_2_d_by = current_data.transfer_sp_2_d_by;
	sp2d.data[0].updated_at = current_data.updated_at;
	sp2d.data[0].updated_by = current_data.updated_by;
	sp2d.data[0].verifikasi_sp_2_d_at = current_data.verifikasi_sp_2_d_at;
	sp2d.data[0].verifikasi_sp_2_d_by = current_data.verifikasi_sp_2_d_by;
	var data_back = {
	 	 message: {
			type: "get-url",
			content: {
			  	url: config.url_server_lokal,
			  	type: "post",
			  	data: sp2d,
			  	return: false
			},
	  	},
	};
	chrome.runtime.sendMessage(data_back, (resp) => {
	  	pesan_loading("Kirim data SP2D ID SKPD="+current_data.id_skpd+" tipe="+tipe+" status="+status+" nomor="+current_data.nomor_sp_2_d);
	});
	
	var url = config.service_url + "pengeluaran/strict/sp2d/pembuatan/cetak/" + current_data.id_sp_2_d;
    new Promise(function (resolve, reject) {
        jQuery.ajax({
            url: url,
            type: 'get',
            dataType: "JSON",
            beforeSend: function (xhr) {                
                xhr.setRequestHeader("Authorization", 'Bearer '+getCookie('X-SIPD-PU-TK'));
            },
            success: function (res) {
                console.log('response detail sp2d', res);
                var sp2d_detail = {
                    action: "singkron_sp2d_detail",
                    tahun_anggaran: _token.tahun,
                    api_key: config.api_key,
                    idSkpd: current_data.id_skpd,
                    id_sp_2_d: current_data.id_sp_2_d,
                    tipe: tipe,
                    sumber: 'ri',
                    data: res[res.jenis.toLowerCase()]
                };
                var data_back = {
                    message: {
                        type: "get-url",
                        content: {
                            url: config.url_server_lokal,
                            type: "post",
                            data: sp2d_detail,
                            return: true
                        },
                    }
                };
                chrome.runtime.sendMessage(data_back, (resp) => {
                    window.singkron_sp2d_detail = {
                        resolve: resolve
                    };
                    pesan_loading("Kirim data SP2D detail ID="+current_data.id_sp_2_d+" tipe="+tipe);
                });
            },
            error: function(err){
                console.log('Error get detail SP2D! id='+current_data.id_sp_2_d, err);
                resolve();
            }
        });
    })
    .then(function () {
        callback();
    });
}