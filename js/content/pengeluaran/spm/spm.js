function singkron_spm_lokal() {
	jQuery('#wrap-loading').show();
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
					pesan_loading('Get SPM dari SKPD "'+current_data.kode_skpd+' '+current_data.nama_skpd+'"');
					singkron_spm_ke_lokal_skpd(current_data.id_skpd,'UP', 'diterima', ()=>{
						singkron_spm_ke_lokal_skpd(current_data.id_skpd,'UP', 'draft', ()=>{
							singkron_spm_ke_lokal_skpd(current_data.id_skpd,'UP', 'dihapus', ()=>{
								singkron_spm_ke_lokal_skpd(current_data.id_skpd,'UP', 'ditolak', ()=>{
									singkron_spm_ke_lokal_skpd(current_data.id_skpd,'GU', 'draft', ()=>{
											singkron_spm_ke_lokal_skpd(current_data.id_skpd,'GU', 'diterima',()=>{
													singkron_spm_ke_lokal_skpd(current_data.id_skpd,'GU', 'dihapus', ()=>{
															singkron_spm_ke_lokal_skpd(current_data.id_skpd,'GU', 'ditolak',()=>{
																	singkron_spm_ke_lokal_skpd(current_data.id_skpd,'TU', 'draft', ()=>{
																			singkron_spm_ke_lokal_skpd(current_data.id_skpd,'TU', 'diterima',()=>{
																					singkron_spm_ke_lokal_skpd(current_data.id_skpd,'TU', 'dihapus', ()=>{
																							singkron_spm_ke_lokal_skpd(current_data.id_skpd,'TU', 'ditolak',()=>{
																									singkron_spm_ke_lokal_skpd(current_data.id_skpd,'LS', 'draft', ()=>{
																											singkron_spm_ke_lokal_skpd(current_data.id_skpd,'LS', 'diterima',()=>{
																													singkron_spm_ke_lokal_skpd(current_data.id_skpd,'LS', 'dihapus', ()=>{
																														singkron_spm_ke_lokal_skpd(current_data.id_skpd,'LS', 'ditolak',()=>{
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
		  alert("Berhasil singkron SPM");
		});
	  },
	});
}

function singkron_spm_ke_lokal_skpd(skpd, tipe, status, callback) {	
    relayAjaxApiKey({
        url: config.service_url+'pengeluaran/strict/spm/index?jenis='+tipe+'&status='+status,
        type: 'get',
          //   dataType: "JSON",
        success: function (response) {
          console.log('response spm', response);
          var spm = {
            action: "singkron_spm",
            tahun_anggaran: _token.tahun,
            api_key: config.api_key,
            idSkpd: skpd,
            tipe: tipe,
            sumber: 'ri',
          //   data: response,
           data: {}
          };
          
          /*
            bulan_gaji: 0
            created_at: "2024-01-25T08:37:55.495294Z"
            created_by: 0
            deleted_at: "0001-01-01T00:00:00Z"
            deleted_by: 0
            id_daerah: 115
            id_jadwal: 0
            id_skpd: 1392
            id_spm: 9248
            id_spp: 10854
            id_sub_skpd: 1392
            id_tahap: 0
            id_unit: 0
            is_kunci_rekening_spm: 0
            is_sptjm_spm: 1
            is_status_perubahan: 0
            is_verifikasi_spm: 1
            jenis_ls_spm: ""
            jenis_spm: "UP"
            keterangan_spm: "Pengajuan UP Tahun 2024 Dinas Pendidikan Kota Batu "
            keterangan_verifikasi_spm: ""
            kode_sub_skpd: "1.01.2.19.0.00.01.0000"
            kode_tahap: ""
            nama_sub_skpd: "Dinas Pendidikan"
            nilai_spm: 200000000
            nomor_spm: "35.79/03.0/000014/UP/1.01.2.19.0.00.01.0000/M/1/2024"
            nomor_spp: "35.79/02.0/000014/UP/1.01.2.19.0.00.01.0000/M/1/2024"
            status_perubahan_at: "0001-01-01T00:00:00Z"
            status_perubahan_by: 0
            status_tahap: ""
            tahun: 2024
            tanggal_spm: "2024-01-26T00:00:00Z"
            updated_at: "0001-01-01T00:00:00Z"
            updated_by: 0
            verifikasi_spm_at: "0001-01-01T00:00:00Z"
            verifikasi_spm_by: 0
          */
            response.map( function(b, i){    
                spm.data[i] = {}
                spm.data[i].idSpm = b.id_spm;
                spm.data[i].idSpp = b.id_spp;
                spm.data[i].created_at = b.created_at;
                spm.data[i].updated_at = b.updated_at;
                // spm.data[i].idDetailSpm = b.id_skpd;
                spm.data[i].id_skpd = b.id_skpd;
                spm.data[i].tahun_anggaran = b.tahun;
                spm.data[i].id_jadwal = b.id_jadwal;
                spm.data[i].id_tahap = b.id_tahap;
                spm.data[i].status_tahap = b.status_tahap;
                spm.data[i].nomorSpp = b.nomor_spp;
                spm.data[i].nilaiSpp = b.nilai_spm;
                // spm.data[i].tanggalSpp = id_sub_giat;
                spm.data[i].keteranganSpp = b.keterangan_spm;
                spm.data[i].idSubUnit = b.id_sub_skpd;
                spm.data[i].nilaiDisetujuiSpp = b.nilai_spm;
                // spm.data[i].tanggalDisetujuiSpp = id_sub_giat;
                spm.data[i].jenisSpp = b.jenis_spm;
                spm.data[i].verifikasiSpp = b.is_verifikasi_spm;
                // spm.data[i].idSpd = b.jenis_ls_spm;
                // spm.data[i].idPengesahanSpj = b.is_sptjm_spm;
                spm.data[i].kunciRekening = b.is_kunci_rekening_spm;
                // spm.data[i].alamatPenerimaSpp = b.id_kontrak;
                // spm.data[i].bankPenerimaSpp = b.id_ba;
                // spm.data[i].nomorRekeningPenerimaSpp = b.created_at;
                // spm.data[i].npwpPenerimaSpp = b.updated_at;
                spm.data[i].jenisLs = b.jenis_ls_spm;
                // spm.data[i].isUploaded = b.status_perubahan_by;
                spm.data[i].tahunSpp = b.tahun;
                // spm.data[i].idKontrak = b.id_spm;
                // spm.data[i].idBA = id_sub_giat;
                spm.data[i].isSpm = b.is_verifikasi_spm;
                spm.data[i].statusPerubahan = b.status_perubahan_by;
                // spm.data[i].isDraft = b.is_sptjm;
                // spm.data[i].isGaji = b.verifikasi_spm_at;
                spm.data[i].is_sptjm = b.is_sptjm_spm;
                // spm.data[i].tanggal_otorisasi = b.bulan_gaji;
                // spm.data[i].is_otorisasi = b.id_pegawai_pptk;
                spm.data[i].bulan_gaji = b.bulan_gaji;
                // spm.data[i].id_pegawai_pptk = id_sub_giat;
                // spm.data[i].nama_pegawai_pptk = b.id_jadwal;
                // spm.data[i].nip_pegawai_pptk = b.id_tahap;
                spm.data[i].kode_tahap = b.kode_tahap;
                // spm.data[i].bulan_tpp = b.kode_tahap;
                spm.data[i].id_pengajuan_tu = b.is_tpp;
                spm.data[i].nomor_pengajuan_tu = b.bulan_tpp;
                // spm.data[i].nomorSpm = b.id_pengajuan_tu;
                spm.data[i].tanggalSpm = b.tanggal_spm;
                spm.data[i].keteranganSpm = b.keterangan_spm;
                spm.data[i].verifikasiSpm = b.is_verifikasi_spm;
                spm.data[i].tanggalVerifikasiSpm = b.verifikasi_spm_at;
                spm.data[i].jenisSpm = b.jenis_spm;
                spm.data[i].nilaiSpm = b.nilai_spm;
                spm.data[i].keteranganVerifikasiSpm = b.keterangan_verifikasi_spm;
                // spm.data[i].isOtorisasi = id_sub_giat;
                // spm.data[i].tanggalOtorisasi = id_sub_giat;
            });
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
            console.log("Kirim data spm ID SKPD="+skpd+" tipe="+tipe+" status="+status+". Response From Background", resp);
          });
        },
	});
  }
        