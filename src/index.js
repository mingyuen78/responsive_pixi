import '@/styles/index.scss';
// needed because I'm using async - for some reason there will be an error if i dont include this.
import "regenerator-runtime/runtime";
import * as PIXI from 'pixi.js';
import { Assets, Sprite } from 'pixi.js';

export default class App {
    init() {
        this.app = new PIXI.Application({
            autoResize: true,
            autoDensity: false,
            view: document.querySelector('#scene'),
            backgroundColor: 0xFFFFFF,
            resolution: window.devicePixelRatio || 1,
        });
        this.PRELOADED = false;
        console.log("Pixi7 initialized...");
        document.body.appendChild(this.app.view);
        window.addEventListener('resize', () => { this.resize() }, false);
        this.resize();
        this.preload();
    }
    resize() {
        this.parentWidth = this.app.view.parentNode.parentElement.clientWidth;
        this.parentHeight = this.app.view.parentNode.parentElement.clientHeight;
        this.app.renderer.resize(this.parentWidth, this.parentHeight);
        console.log("resizing...");
        this.DEADCENTER_H = this.parentWidth / 2;
        this.DEADCENTER_V = this.parentHeight / 2;
        if (this.PRELOADED) {
            //clear stage and re-render, preload not necessary as assets are loaded already;
            this.app.stage.removeChildren();
            this.drawScene();
        }
    }
    async preload() {
        this.spriteText = new PIXI.Text('Loading...', { fontFamily: 'Arial', fontSize: 18, fontWeight: "bold", fill: 0x999999, align: 'center' });
        this.spriteText.anchor.set(0.5);
        this.spriteText.x = (this.parentWidth / 2);
        this.spriteText.y = (this.parentHeight / 2);
        this.app.stage.addChild(this.spriteText);

        Assets.addBundle('pipeline', {
            bunny: 'bunny.png',
            example: 'example.png',
            favicon: 'favicon.png',
            largebg: 'bg.jpg',
            bg: 'bgiso.png'
        });
        this.assetPipeline = await Assets.loadBundle('pipeline', (evt) => { this.onProgress(evt) });
        this.drawScene();
    }
    onProgress(evt) {
        if (evt == 1) {
            this.spriteText.text = "Loading Complete...";
            this.PRELOADED = true;
            this.spriteText.destroy();
        } else {
            this.spriteText.text = `Loading ${evt * 100}%...`;
        }
    }
    drawScene() {

        //texture to sprite.
        let bgTexture = this.assetPipeline.bg;
        this.bgContainer = new PIXI.Container();
        this.bunnyContainer = new PIXI.Container();

        let bg = Sprite.from(bgTexture);
        bg.anchor.set(0.5);
        bg.scale.set(0.5);
        bg.x = this.DEADCENTER_H;
        bg.y = this.DEADCENTER_V;

        //container to add layering, zindex.
        this.bgContainer.addChild(bg);

        let bunnyTexture = this.assetPipeline.bunny;
        let bunny1 = Sprite.from(bunnyTexture);
        bunny1.anchor.set(0.5);
        bunny1.x = this.DEADCENTER_H + 150;
        bunny1.y = this.DEADCENTER_V + 50;

        let bunny2 = Sprite.from(bunnyTexture);
        bunny2.anchor.set(0.5);
        bunny2.x = this.DEADCENTER_H + 105;
        bunny2.y = this.DEADCENTER_V + 155;

        let bunny3 = Sprite.from(bunnyTexture);
        bunny3.anchor.set(0.5);
        bunny3.x = this.DEADCENTER_H - 85;
        bunny3.y = this.DEADCENTER_V - 55;

        //container to add layering, zindex.
        this.bunnyContainer.addChild(bunny1);
        this.bunnyContainer.addChild(bunny2);
        this.bunnyContainer.addChild(bunny3);

        this.app.stage.addChild(this.bgContainer);
        this.app.stage.addChild(this.bunnyContainer);
    }

}

let app = new App();
app.init();