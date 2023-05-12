import { Component, OnInit, VERSION } from '@angular/core';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  a = 'data';
  b =
    'Official documentation is in progress, this document is just a glimpse of what is possible with pdfmake and its layout engine.';
  c = 'capgemini';
  aar1 = ['http://google.com', 'http://capgemini.com', 'http://facebook.com'];
  content =
    '<p>An image can be search from<a target="_blank" rel="noopener noreferrer" href="https://www.google.com">Google Page</a> and can be downloaded using the link <a href="resource.png" download="download">download image</a>.</p>';
  contentText = '';
  linkArr = [];
  textbetweenTags = [];

  ngOnInit(): void {
    this.contentOptimize();
  }

  // const container = document.createElement('div');
  //  container<>.innerHTML = this.content;
  // cleanComment =  container.innerText || container.textContent ; //innerText for IE<=8
  contentOptimize() {
    const container = document.createElement('div');
    container.innerHTML = this.content;
    this.contentText = container.innerText || container.textContent; //innerText for
    const regex = /<a[^>]*href=["']([^"']*)["']/gm;
    const aregText = /<a(.*?)<\/a>/gm;
    // Alternative syntax using RegExp constructor
    // const regex = new RegExp('<a[^>]*href=["\']([^"\']*)["\']', 'gm')

    // const str = `<p>An image can be search from<a target="_blank" rel="noopener noreferrer" href="https://www.google.com">Google Page</a> and can be downloaded using the link <a href="resource.png" download="download">download image</a>.</p>
    // `;
    let m;

    while ((m = regex.exec(this.content)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      // The result can be accessed through the `m`-variable.
      m.forEach((match, groupIndex) => {
        console.log(`Found match, group ${groupIndex}: ${match}`);
        if (groupIndex === 1) {
          this.linkArr.push(match);
          // console.log(`${match}`);
          console.log(this.linkArr);
        } else {
          // console.log('' + 'I am from else block ');
        }
      });
    }
    //  link stored in array
    let getAncharText;
    const totalAnchor = [1, 2, 3, 4, 5, 6, 7];

    for (const val of totalAnchor) {
      getAncharText = aregText.exec(this.content);
      if (getAncharText == null) {
        break;
      }
      if (getAncharText.index === aregText.lastIndex) {
        aregText.lastIndex++;
      }
      getAncharText.forEach((amatch, agroupIndex) => {
        //     console.log(`Found match, group ${agroupIndex}: ${amatch}`);
        if (agroupIndex === 1) {
          const aindex = amatch.indexOf('>');
          const matchLength = amatch.length;
          this.textbetweenTags.push(amatch.substring(aindex + 1, matchLength));
        }
        // console.log(textbetweenTags);
      });
    }
  }

  public export(): void {
    console.log(this.textbetweenTags);
    console.log(this.linkArr);

    const docDefinition = {
      content: [
        { text: 'Tables', style: 'header' },
        'Official documentation is in progress, this document is just a glimpse of what is possible with pdfmake and its layout engine.',
        {
          text: 'A simple table (no headers, no width specified, no spans, no styling)',
          style: 'subheader',
        },
        'The following table has nothing more than a body array',
        {
          style: 'tableExample',
          table: {
            widths: ['auto', 200],
            body: [
              [
                'Project Name',
                [
                  { text: this.contentText },
                  {
                    text: this.textbetweenTags[0],
                    link: this.linkArr[0],
                    color: 'blue',
                  },
                  {
                    text: this.textbetweenTags[1],
                    link: this.linkArr[1],
                    color: 'blue',
                  },
                  // {
                  //   text: 'Capgemini',
                  //   link: this.linkArr[1],
                  //   color: 'blue',
                  // },
                  // {
                  //   text: 'facebook',
                  //   link: this.aar1[2],
                  //   color: 'blue',
                  // },
                ],
              ],
              ['Project Description', `  ${'test' + '' + this.a + this.b} `],
              ['Project Type', ` ${'testing'} `],
              [
                'Brand',
                ` ${"f.marketDetails.projDetail === null  ? ' ' : f.marketDetails.projDetail.brandDesc"} `,
              ],
              [
                'Launch Timeline',
                ` ${"f.marketDetails.projDetail === null  ? ' ' : f.marketDetails.projDetail.launchTimeLine"} `,
              ],
              ['Manufacturing Country', ` ${''} `],
              ['Manufacturing Sites ', ` ${'New Data'} `],
              ['Comments', `${'data'} `],
            ],
          },
        },
      ],

      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5],
        },
        tableExample: {
          margin: [0, 5, 0, 15],
        },
      },
    };

    pdfMake.createPdf(docDefinition).download('test.pdf');
  }
}
