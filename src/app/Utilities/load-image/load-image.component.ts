import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgxImageCompressService } from 'ngx-image-compress';

@Component({
  selector: 'app-load-image',
  templateUrl: './load-image.component.html',
  styleUrls: ['./load-image.component.scss']
})
export class LoadImageComponent implements OnInit {
  filesize: number;
  @Output() imageB64 = new EventEmitter<any>();

  constructor(private imageCompress: NgxImageCompressService) {
    console.log('Constructor');
   }

  ngOnInit() {
  }

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
         this.imageB64.emit(resp);
        }
      );
    } else {
      this.imageB64.emit(reader.result);
    }
  }

}
