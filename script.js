(function ball() {
   const ballGameWrapper = document.querySelector('.ball-game');
   const ball = document.querySelector('.ball');
   const ballShadow = document.querySelector('.shadow');

   let kicksCount = -1;
   const kicksCountElement = document.querySelector('.kicks');

   let cashBackValue = -1;
   const cashBackMaxValue = 5;
   const cashBackValueElement = document.querySelector('.kicks-percents').querySelector('span');

   let heightOnePickBall = undefined;
   let maxHeightPickBall = undefined;

   window.addEventListener('resize', () => {
      heightOnePickBall = ballGameWrapper.clientHeight / 4;
      maxHeightPickBall = ballGameWrapper.clientHeight * .375;

      document.querySelector('.height-place-kicks').style.height = `${maxHeightPickBall}px`;
   });

   TweenMax.set(ball, { y: 0 });

   ball.style.filter = 'blur(4px)';

   ball.addEventListener('pointerdown', event => event.pointerType === 'mouse' && moveBall());

   let touchStartY = 0;

   ball.addEventListener('touchstart', event => touchStartY = event.changedTouches[0].clientY);

   ball.addEventListener('touchend', event => touchStartY - event.changedTouches[0].clientY > 0 && moveBall());

   TweenMax.ticker.addEventListener('tick', updateShadow);

   function moveBall() {
      const y = ball._gsTransform.y;

      if (y < (maxHeightPickBall * -1)) {
         console.log('no kick');
         return;
      }

      kicksCountElement.innerHTML = `${++kicksCount}`;

      if (cashBackValue < cashBackMaxValue) {
         if (kicksCount > cashBackValue && kicksCount <= cashBackMaxValue) {
            cashBackValueElement.innerText = `${++cashBackValue}`;
         }

         if (kicksCount === cashBackMaxValue) {
            document.querySelector('.your-cash-back').style.visibility = 'visible';
         }
      }

      if (kicksCount === 2) {
         ball.style.filter = 'blur(2px)';
      } else if (kicksCount === 3) {
         ball.style.filter = 'blur(0)';
      }

      TweenMax.killTweensOf(ball);

      ball._tl && ball._tl.kill();
      ballShadow._tl && ballShadow._tl.kill();

      const tl = new TimelineMax();

      tl
         .to(ball, 1.4, {
            y: y - heightOnePickBall,
            ease: Power2.easeOut
         })
         // .to(ballShadow, .4, {
         //    scaleX: .3,
         //    scaleY: .3,
         //    opacity: .3,
         //    ease: Power2.easeOut
         // }, 0)
         .to(ball, 1.5, {
            y: 0,
            ease: Power2.easeIn,
            onComplete: () => {
               kicksCount = -1;
               kicksCountElement.innerText = 0;
               ball.style.filter = 'blur(4px)';
            }
         })
         // .to(ballShadow, .5, {
         //    scaleX: 1,
         //    scaleY: 1,
         //    opacity: 1,
         //    ease: Power2.easeIn
         // }, '-=0.5')
         .to(ball, .08, {
            scaleY: .75,
            scaleX: 1.25,
            transformOrigin: '50% 100%',
            ease: Power0.easeNone
         })
         .to(ball, .02, {
            scaleY: 1,
            scaleX: 1,
            ease: Power2.easeOut,
         });

      let height = heightOnePickBall * .6;
      let duration = .35;

      for (let i = 0; i < 3; i++) {
         tl
            .to(ball, duration, {
               y: -height,
               ease: Power2.easeOut
            })
            // .to(ballShadow, duration, {
            //    scaleX: .3,
            //    scaleY: .3,
            //    opacity: .3,
            //    ease: Power2.easeOut
            // }, `-=${duration}`)
            .to(ball, duration, {
               y: 0,
               ease: Power2.easeIn
            })
            // .to(ballShadow, duration, {
            //    scaleX: 1,
            //    scaleY: 1,
            //    opacity: 1,
            //    ease: Power2.easeIn
            // }, `-=${duration}`)
            .to(ball, .06, {
               scaleY: .85,
               scaleX: 1.15,
               transformOrigin: '50% 100%',
               ease: Power0.easeNone
            })
            .to(ball, .015, {
               scaleY: 1,
               scaleX: 1
            });

         height *= .5;
         duration *= .5;
      }
   }

   function updateShadow() {
      console.log('updateShadow');

      const y = Math.abs(ball._gsTransform.y);

      const progress = Math.min(y / maxHeightPickBall, 1);

      const scale = 1 - progress * .7;

      TweenMax.set(ballShadow, {
         scaleX: scale,
         scaleY: scale,
         opacity: 1 - progress * .7,
      })
   }
}());
