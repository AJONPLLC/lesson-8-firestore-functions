import {
  Component,
  Input,
  ViewChild,
  Renderer2,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit, OnDestroy {
  @Input()
  icon: string;
  @Input()
  removeIcon: string;
  @Input()
  maxSize: number;

  @ViewChild('imageContainer') imageContainer;
  @ViewChild('fileLoadContainer') fileLoadContainer;

  @Output() changed = new EventEmitter<any>();

  isHovering: boolean;
  base64$: Subject<any>;
  parsing$: Subject<boolean>;
  input: any;
  imageSubscription: Subscription;

  constructor(private renderer: Renderer2) {
    this.base64$ = new Subject();
    this.parsing$ = new Subject();
    if (!this.icon) {
      this.icon = 'camera';
    }
    if (!this.removeIcon) {
      this.removeIcon = 'trash-alt';
    }
    if (!this.maxSize) {
      this.maxSize = 2000;
    }
  }

  ngOnInit() {
    this.createFileLoader();
    this.base64$.subscribe(base64 => {
      if (base64) {
        const img = this.renderer.createElement('img');
        img.src = base64;
        this.renderer.appendChild(this.imageContainer.nativeElement, img);
      }
    });
  }
  ngOnDestroy() {
    this.base64$.unsubscribe();
  }

  createFileLoader() {
    this.input = this.renderer.createElement('input');
    this.renderer.addClass(this.input, 'file-input');
    this.renderer.setAttribute(this.input, 'id', 'fileLoader');
    this.renderer.setAttribute(this.input, 'type', 'file');
    this.renderer.setProperty(this.input, 'hidden', true);
    this.renderer.appendChild(this.fileLoadContainer.nativeElement, this.input);
    this.renderer.listen(this.input, 'change', e =>
      this.startUpload(e.srcElement.files)
    );
  }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }
  removeImage() {
    this.base64$.next('');
    while (this.imageContainer.nativeElement.firstChild) {
      this.imageContainer.nativeElement.removeChild(
        this.imageContainer.nativeElement.firstChild
      );
    }
    while (this.fileLoadContainer.nativeElement.firestChild) {
      this.fileLoadContainer.nativeElement.removeChild(
        this.fileLoadContainer.nativeElement.firstChild
      );
    }
    this.createFileLoader();
    this.changed.emit(null);
  }
  startUpload(event: FileList) {
    // The File object
    const file = event.item(0);

    // Client-side validation example
    if (file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type :( ');
      return;
    }

    this.parsing$.next(true);

    // Clear the image
    this.base64$.next(null);
    const that = this;
    const reader = new FileReader();

    reader.addEventListener(
      'load',
      function() {
        that.getOrientation(file, function(orientation) {
          that.resetOrientation(
            reader.result,
            orientation,
            blob => {
              that.changed.emit(blob);
            },
            base64 => {
              that.base64$.next(base64);
              that.parsing$.next(false);
            }
          );
        });
      },
      false
    );

    if (file) {
      reader.readAsDataURL(file);
    }
  }
  presentActionSheet() {
    this.input.click();
  }
  // Determines if the upload task is active
  isActive(snapshot) {
    return (
      snapshot.state === 'running' &&
      snapshot.bytesTransferred < snapshot.totalBytes
    );
  }
  getOrientation(file, callback) {
    const reader = new FileReader();
    reader.onload = function(e: any) {
      const view = new DataView(e.target.result);
      if (view.getUint16(0, false) !== 0xffd8) {
        return callback(-2);
      }
      const length = view.byteLength;
      let offset = 2;
      while (offset < length) {
        const marker = view.getUint16(offset, false);
        offset += 2;
        if (marker === 0xffe1) {
          if (view.getUint32((offset += 2), false) !== 0x45786966) {
            return callback(-1);
          }
          const little = view.getUint16((offset += 6), false) === 0x4949;
          offset += view.getUint32(offset + 4, little);
          const tags = view.getUint16(offset, little);
          offset += 2;
          for (let i = 0; i < tags; i++) {
            if (view.getUint16(offset + i * 12, little) === 0x0112) {
              return callback(view.getUint16(offset + i * 12 + 8, little));
            }
          }
          // tslint:disable-next-line:no-bitwise
        } else if ((marker & 0xff00) !== 0xff00) {
          break;
        } else {
          offset += view.getUint16(offset, false);
        }
      }
      return callback(-1);
    };
    reader.readAsArrayBuffer(file);
  }
  resetOrientation(srcBase64, srcOrientation, callbackBlob, callbackBase64) {
    const img = new Image();
    const that = this;

    img.onload = function() {
      let width = img.width,
        height = img.height;
      const canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        max_size = that.maxSize;

      if (width > height) {
        if (width > max_size) {
          height *= max_size / width;
          width = max_size;
        }
      } else {
        if (height > max_size) {
          width *= max_size / height;
          height = max_size;
        }
      }

      // set proper canvas dimensions before transform & export
      if (4 < srcOrientation && srcOrientation < 9) {
        canvas.width = height;
        canvas.height = width;
      } else {
        canvas.width = width;
        canvas.height = height;
      }

      // transform context before drawing image
      switch (srcOrientation) {
        case 2:
          ctx.transform(-1, 0, 0, 1, width, 0);
          break;
        case 3:
          ctx.transform(-1, 0, 0, -1, width, height);
          break;
        case 4:
          ctx.transform(1, 0, 0, -1, 0, height);
          break;
        case 5:
          ctx.transform(0, 1, 1, 0, 0, 0);
          break;
        case 6:
          ctx.transform(0, 1, -1, 0, height, 0);
          break;
        case 7:
          ctx.transform(0, -1, -1, 0, height, width);
          break;
        case 8:
          ctx.transform(0, -1, 1, 0, 0, width);
          break;
        default:
          break;
      }

      // draw image
      ctx.drawImage(img, 0, 0, width, height);

      // export base64
      canvas.toBlob(callbackBlob);
      callbackBase64(canvas.toDataURL());
    };

    img.src = srcBase64;
  }
}
