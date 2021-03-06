import {Component, ElementRef, ViewChild} from '@angular/core';

enum FileType {
   Folder,
   Document,
   Picture
}

export interface File {
   parent: number;
   parentName: string;
   level: number;
   name: string;
   origPath?: string;
   splitPath?: string[];
   fileType?: FileType;
   isOpen?: boolean;
}



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'fileviewer';

  files: string[] = [
    "marvel/black_widow/bw.png",
    "marvel/drdoom/the-doctor.png",
    "fact_marvel_beats_dc.txt",
    "dc/aquaman/mmmmmomoa.png",
    "dc/aquaman/test/test.png",
    "dc/aquaman/test/test2/test2.png",
    "dc/aquaman/test/test2/test3/test3.png",
    "marvel/black_widow/why-the-widow-is-awesome.txt",
    "dc/aquaman/movie-review-collection.txt",
    "marvel/marvel_logo.png",
    "dc/character_list.txt"
  ];

  fileList: File[] = [];

  isToggleAll: boolean = true;

  fileStr: string = '';


  constructor() {
  }

  ngOnInit() {
      this.loadFiles();

  }


  add() {

    if (this.fileStr.length >= 1) {

      if (this.files.find(x => x === this.fileStr)) {
          alert('File exists already!');
          return;
      }

      this.files.push(this.fileStr);
      this.fileStr = '';
    }

    this.loadFiles();
  }

  toggleAll() {
    this.isToggleAll = !this.isToggleAll;
    this.fileList.forEach(x => x.isOpen = this.isToggleAll);
  }

  toggle(file: File) {

     if (file.fileType !== FileType.Folder) {
       return;
     }

     file.isOpen = !file.isOpen;
  }

  getFontClass(fileType: FileType): string {

      switch (fileType) {
        case FileType.Document:
          return 'far fa-file-word';
        case FileType.Folder:
          return 'far fa-folder';
        case FileType.Picture:
          return 'fas fa-file-image';
        default:
          return '';
      }
  }



  getLevelPaths(level: number) {
    return this.fileList.filter(x => x.level === level);
  }

  getChildren(parent: number, parentName: string) {
     return this.fileList.filter(x => x.level > x.parent && x.parent === parent && x.parentName === parentName);
  }

  private loadFiles(): void {
    this.files = this.files.sort();

    this.files.forEach(x => {

      const splittedPath = x.split('/');

      splittedPath.forEach(y => {
        const files: File[] = this.pathInfo(splittedPath, x);
        this.fileList.push(...files);
      });
    });

    this.fileList
      .sort((a, b) => a.level - b.level);
  }

  private pathInfo(paths: string[], origPath: string): File[] {
      const fileList: File[] = [];
      let index = 0;
      for(const path of paths) {
          const parentLevel = index > 0 ? index - 1 : 0;
          const parentName = paths[parentLevel];

          if (!this.fileList.find(x => x.name == path && x.level == index && x.parentName === parentName)) {

            const file: File = {
              parent: parentLevel,
              parentName: parentName,
              level: index,
              name: path,
              origPath: origPath,
              isOpen: true,
              fileType: this.setFileType(path)
            };

            fileList.push(file);
          }

          index += 1;
      }

      return fileList;
  }

  private setFileType(name: string): FileType {

    if(name.indexOf('.png') > -1) {
       return FileType.Picture;
    } else if (name.indexOf('.txt') > -1) {
       return FileType.Document;
    }

    return FileType.Folder;
  }
}
