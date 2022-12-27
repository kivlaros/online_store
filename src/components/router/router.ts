/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Loader } from '../loader/loader';
import { GalleryFilter } from '../gallery/gallery_filter';
import { CartPage } from '../cart/cart_page';
import { Header } from '../header/header';

export class Router {
  loader: Loader;
  galleryFilter: GalleryFilter | null;
  isNewPage = true;
  url: URL;
  cartPage: CartPage | null;
  header: Header | null;
  constructor() {
    this.loader = new Loader();
    this.galleryFilter = null;
    this.cartPage = null;
    this.url = new URL(window.location.href);
    this.header = new Header('body');
    this.historyEventTarcker();
    this.newPageRoute();
    this.isNewPage = false;
  }
  historyEventTarcker() {
    window.addEventListener('onpushstate', () => {
      this.historyEventHendler();
    });

    window.addEventListener('popstate', () => {
      this.historyEventHendler();
    });
  }
  historyEventHendler() {
    setTimeout(async () => {
      //это костыль
      this.isNewPage = this.isNewPageHandler();
      this.urlUpdate();
      this.clearMain();
      await this.newPageRoute();
    }, 100);
  }

  async newPageRoute() {
    if (this.isNewPage) {
      if (this.url.pathname == '/') {
        await this.loadAndCreateGallery();
      } else if (this.url.pathname == '/cart') {
        this.cartPage = new CartPage();
      } else if ((await this.getProductRouteList()).includes(this.url.pathname)) {
        await this.createItemPage();
      } else {
        alert('it"s a 404 live with it');
      }
    }
  }

  async getProductRouteList() {
    const data = await this.loader.load();
    return data.reduce((acc: string[], e) => {
      acc.push(`/product${e.id}`);
      return acc;
    }, []);
  }

  async loadAndCreateGallery() {
    const data = await this.loader.load();
    this.galleryFilter = new GalleryFilter('main', data);
  }

  async createItemPage() {
    await this.loadAndCreateGallery();
    const $main = document.getElementById('main')!;
    $main.innerHTML = '';
    let productItemsArr = this.galleryFilter?.gallery.productsArr;
    const id = parseInt(this.url.pathname.replace(/[^\d]/g, ''));
    productItemsArr = productItemsArr?.filter(e => e.id == id);
    if (productItemsArr) productItemsArr[0].selfPageRender();
  }

  urlUpdate() {
    this.url = new URL(window.location.href);
  }

  isNewPageHandler(): boolean {
    const newUrl = new URL(window.location.href);
    return !(this.url.pathname == newUrl.pathname);
  }

  clearMain() {
    if (this.isNewPage) {
      const $main = document.getElementById('main')!;
      $main.innerHTML = '';
    }
  }
}
