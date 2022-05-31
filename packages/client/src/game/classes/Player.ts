import {
  AnimatedSprite,
  Application,
  Container,
  Text,
  TextStyle,
  SCALE_MODES,
  Sprite,
} from 'pixi.js';
import Collision from './Collision';

export default class Player {
  name: string;
  id: string;
  display: Container;
  container: Container;
  app: Application;
  sprite: AnimatedSprite | null = null;
  currentDirection: 'up' | 'down' | 'left' | 'right' = 'down';
  isIdle = false;
  isLoaded = false;

  constructor(display: Container, app: Application, name: string, id: string) {
    this.name = name;
    this.id = id;
    this.display = display;
    this.app = app;

    this.container = new Container();

    console.log({
      playerX: app.renderer.screen.width / 2,
      playerY: app.renderer.screen.height / 2,
    });

    this.container.position.x = app.renderer.screen.width / 2;
    this.container.position.y = app.renderer.screen.height / 2;
    this.container.zIndex = 2;
  }

  draw() {
    this.updateSprite('down', true);
  }

  updateSprite(direction: 'up' | 'down' | 'left' | 'right', isIdle = false) {
    this.currentDirection = direction;
    this.isIdle = isIdle;
    this.container.removeChildren(0);

    const sheet = this.app.loader.resources['character'];

    const nameStyle = new TextStyle({
      fill: '#ffffff',
    });

    const name = new Text(this.name, nameStyle);

    this.container.addChild(name);

    if (sheet.spritesheet) {
      this.sprite = new AnimatedSprite(
        isIdle
          ? sheet.spritesheet.animations[`char_idle_${direction}`]
          : sheet.spritesheet.animations[`char_${direction}`]
      );

      this.sprite.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
      this.sprite.width = 64;
      this.sprite.height = 64;
      this.sprite.anchor.set(-0.15, -0.5);
      this.sprite.animationSpeed = 0.167;
      this.sprite.play();
      this.container.addChild(this.sprite);
    }

    this.display.addChild(this.container);
    this.isLoaded = true;
  }

  move(keys: { [key: string]: boolean }) {
    let movement = 5;

    Collision.houses.forEach((house: Sprite) => {
      if (
        this.sprite &&
        Collision.bump.hit(this.container, house, true, false, true)
      ) {
        movement = 0;
      }
    });

    if (keys['ArrowDown']) {
      this.container.position.y += movement;

      if (this.currentDirection != 'down' || this.isIdle) {
        this.updateSprite('down');
      }

      return;
    }

    if (keys['ArrowUp']) {
      this.container.position.y -= movement;

      if (this.currentDirection != 'up' || this.isIdle) {
        this.updateSprite('up');
      }

      return;
    }

    if (keys['ArrowRight']) {
      this.container.position.x += movement;

      if (this.currentDirection != 'right' || this.isIdle) {
        this.updateSprite('right');
      }

      return;
    }

    if (keys['ArrowLeft']) {
      this.container.position.x -= movement;

      if (this.currentDirection != 'left' || this.isIdle) {
        this.updateSprite('left');
      }

      return;
    }

    if (
      keys['ArrowDown'] == false &&
      keys['ArrowUp'] == false &&
      keys['ArrowRight'] == false &&
      keys['ArrowLeft'] == false
    ) {
      if (this.isIdle == false) {
        this.updateSprite(this.currentDirection, true);
      }

      return;
    }
  }
}
