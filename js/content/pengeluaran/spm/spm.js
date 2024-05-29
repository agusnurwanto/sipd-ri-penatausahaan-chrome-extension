// function singkron_spm_lokal(data=['UP', 'LS', 'GU', 'TU']) {
function singkron_spm_lokal(val, type_data) {
	jQuery('#wrap-loading').show();
    // status = draft , diterima , dihapus , ditolak
    // var status = 'diterima';
    var status = val;
    // var type_data = data.shift();
    var type_data = type_data;
    new Promise(function(resolve, reject){
        if(typeof type_data == 'undefined'){
            return resolve();
        }
        pesan_loading('Get data SPM jenis='+type_data+' , status='+status);
    	relayAjaxApiKey({
            url: config.service_url+'pengeluaran/strict/spm/index?jenis='+type_data+'&status='+status,
            type: 'get',
            success: function (response) {
        		console.log('SPM', response);
        		var page_skpd = {};
                var last = response.length-1;
                response.reduce(function (sequence, nextData) {
                    return sequence.then(function (current_data) {
                        return new Promise(function (resolve_reduce, reject_reduce) {
                            pesan_loading('Get SPM '+type_data+' dari ID SKPD "'+current_data.id_skpd+'"');
                            if(!page_skpd[current_data.id_skpd]){
                                page_skpd[current_data.id_skpd] = [];
                            }
                            page_skpd[current_data.id_skpd].push(current_data);

                            // melakukan reset page sesuai data per skpd
                            current_data.page = page_skpd[current_data.id_skpd].length;

        					singkron_spm_ke_lokal_skpd(current_data, type_data, status, ()=>{
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
        		    return singkron_spm_lokal(data);
        		});
            },
    	});
    })
    .then(function () {
        jQuery("#wrap-loading").hide();
        alert("Berhasil singkron SPM");
    });
}

function singkron_spm_ke_lokal_skpd(current_data, tipe, status, callback) {
    var spm = {
        action: "singkron_spm",
        tahun_anggaran: _token.tahun,
        api_key: config.api_key,
        idSkpd: current_data.id_skpd,
        tipe: tipe,
        sumber: 'ri',
        page: current_data.page,
        data: {}
    };

    spm.data[0] = {}
    spm.data[0].idSpm = current_data.id_spm;
    spm.data[0].idSpp = current_data.id_spp;
    spm.data[0].created_at = current_data.created_at;
    spm.data[0].updated_at = current_data.updated_at;
    // spm.data[0].idDetailSpm = current_data.id_skpd;
    spm.data[0].id_skpd = current_data.id_skpd;
    spm.data[0].tahun_anggaran = current_data.tahun;
    spm.data[0].id_jadwal = current_data.id_jadwal;
    spm.data[0].id_tahap = current_data.id_tahap;
    spm.data[0].status_tahap = current_data.status_tahap;
    spm.data[0].nomorSpp = current_data.nomor_spp;
    spm.data[0].nilaiSpp = current_data.nilai_spm;
    // spm.data[0].tanggalSpp = id_sub_giat;
    spm.data[0].keteranganSpp = current_data.keterangan_spm;
    spm.data[0].idSubUnit = current_data.id_sub_skpd;
    spm.data[0].nilaiDisetujuiSpp = current_data.nilai_spm;
    // spm.data[0].tanggalDisetujuiSpp = id_sub_giat;
    spm.data[0].jenisSpp = current_data.jenis_spm;
    spm.data[0].verifikasiSpp = current_data.is_verifikasi_spm;
    // spm.data[0].idSpd = current_data.jenis_ls_spm;
    // spm.data[0].idPengesahanSpj = current_data.is_sptjm_spm;
    spm.data[0].kunciRekening = current_data.is_kunci_rekening_spm;
    // spm.data[0].alamatPenerimaSpp = current_data.id_kontrak;
    // spm.data[0].bankPenerimaSpp = current_data.id_ba;
    // spm.data[0].nomorRekeningPenerimaSpp = current_data.created_at;
    // spm.data[0].npwpPenerimaSpp = current_data.updated_at;
    spm.data[0].jenisLs = current_data.jenis_ls_spm;
    // spm.data[0].isUploaded = current_data.status_perubahan_by;
    spm.data[0].tahunSpp = current_data.tahun;
    // spm.data[0].idKontrak = current_data.id_spm;
    // spm.data[0].idBA = id_sub_giat;
    spm.data[0].isSpm = current_data.is_verifikasi_spm;
    spm.data[0].statusPerubahan = current_data.status_perubahan_by;
    // spm.data[0].isDraft = current_data.is_sptjm;
    // spm.data[0].isGaji = current_data.verifikasi_spm_at;
    spm.data[0].is_sptjm = current_data.is_sptjm_spm;
    // spm.data[0].tanggal_otorisasi = current_data.bulan_gaji;
    // spm.data[0].is_otorisasi = current_data.id_pegawai_pptk;
    spm.data[0].bulan_gaji = current_data.bulan_gaji;
    // spm.data[0].id_pegawai_pptk = id_sub_giat;
    // spm.data[0].nama_pegawai_pptk = current_data.id_jadwal;
    // spm.data[0].nip_pegawai_pptk = current_data.id_tahap;
    spm.data[0].kode_tahap = current_data.kode_tahap;
    // spm.data[0].bulan_tpp = current_data.kode_tahap;
    spm.data[0].id_pengajuan_tu = current_data.is_tpp;
    spm.data[0].nomor_pengajuan_tu = current_data.bulan_tpp;
    spm.data[0].nomorSpm = current_data.nomor_spm;
    spm.data[0].tanggalSpm = current_data.tanggal_spm;
    spm.data[0].keteranganSpm = current_data.keterangan_spm;
    spm.data[0].verifikasiSpm = current_data.is_verifikasi_spm;
    spm.data[0].tanggalVerifikasiSpm = current_data.verifikasi_spm_at;
    spm.data[0].jenisSpm = current_data.jenis_spm;
    spm.data[0].nilaiSpm = current_data.nilai_spm;
    spm.data[0].keteranganVerifikasiSpm = current_data.keterangan_verifikasi_spm;
    // spm.data[0].isOtorisasi = id_sub_giat;
    // spm.data[0].tanggalOtorisasi = id_sub_giat;

    var data_back = {
        message: {
            type: "get-url",
            content: {
                url: config.url_server_lokal,
                type: "post",
                data: spm,
                return: false
            },
        },
    };
    chrome.runtime.sendMessage(data_back, (resp) => {
        pesan_loading("Kirim data SPM ID SKPD="+current_data.id_skpd+" tipe="+tipe+" status="+status+" keterangan = "+current_data.keterangan_spm);
    });
    if(tipe == 'UP'){
        return callback();
    }

    new Promise(function (resolve, reject) {
        jQuery.ajax({
            url: config.service_url + "pengeluaran/strict/spm/cetak/" + current_data.id_spm,
            type: 'get',
            dataType: "JSON",
            beforeSend: function (xhr) {                
                xhr.setRequestHeader("Authorization", 'Bearer '+getCookie('X-SIPD-PU-TK'));
            },
            success: function (res) {
                console.log('response detail spm', res);
                var spm_detail = {
                    action: "singkron_spm_detail",
                    tahun_anggaran: _token.tahun,
                    api_key: config.api_key,
                    idSkpd: current_data.id_skpd,
                    id_spm: current_data.id_spm,
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
                            data: spm_detail,
                            return: true
                        },
                    }
                };
                chrome.runtime.sendMessage(data_back, (resp) => {
                    window.singkron_spm_detail = {
                        resolve: resolve
                    };
                    pesan_loading("Kirim data SPM detail ID="+current_data.id_spm+" tipe="+tipe);
                });
            },
            error: function(err){
                console.log('Error get detail SPM! id='+current_data.id_spm, err);
                resolve();
            }
        });
    })
    .then(function () {
        callback();
    });
}        