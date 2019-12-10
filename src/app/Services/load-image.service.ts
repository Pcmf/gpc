import { Injectable } from '@angular/core';
import { NgxImageCompressService } from 'ngx-image-compress';

@Injectable({
  providedIn: 'root'
})
export class LoadImageService {
  filesize: number;

  constructor(private imageCompress: NgxImageCompressService) { }

  handleInputChange(e) {
    const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    this.filesize = file.size;
    const pattern2 = /image-*/;
    const reader = new FileReader();
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }
  _handleReaderLoaded(e) {
    const reader = e.target;
    if (this.filesize > 30000) {
      this.imageCompress.compressFile(reader.result, 1, 50, 80).then(
        (resp: any) => {
         return resp;
        }
      );
    } else {
      return reader.result;
    }
  }
}
