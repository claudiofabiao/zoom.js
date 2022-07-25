(function () {
    const DEFAULT_MIN = 100;
    const DEFAULT_MAX = 200;
    const DEFAULT_STEP = 10;
    const DEFAULT_INITIAL = 100;

    const wrappers = document.querySelectorAll('.zoom-wrapper');

    wrappers.forEach(function (wrapper) {
        const min = wrapper.dataset.min ? parseInt(wrapper.dataset.min) : DEFAULT_MIN;
        const max = wrapper.dataset.max ? parseInt(wrapper.dataset.max) : DEFAULT_MAX;
        const step = wrapper.dataset.step ? parseInt(wrapper.dataset.step) : DEFAULT_STEP;
        const initial = wrapper.dataset.initial ? parseInt(wrapper.dataset.initial) : DEFAULT_INITIAL;

        const image = wrapper.querySelector('.zoom-image');
        const controls = wrapper.querySelector('.zoom-controls');
        const increaseControl = wrapper.querySelector('.zoom-increase-control');
        const decreaseControl = wrapper.querySelector('.zoom-decrease-control');

        let top = 0;
        let left = 0;
        let topLimit = 0;
        let leftLimit = 0;
        let moving = false;
        let movable = false;
        let scale = initial;

        decreaseControl.disabled = true;

        applyStyles();

        wrapper.addEventListener('mouseup', function () {
            stopMovement();
        });

        wrapper.addEventListener('mousedown', function () {
            startMovement();
        });

        wrapper.addEventListener('mouseleave', function () {
            stopMovement();
        });

        wrapper.addEventListener('mousemove', function (event) {
            if (moving) {
                const newLeft = left + event.movementX;
                const newTop = top + event.movementY;

                if (newLeft < leftLimit) {
                    left = leftLimit;
                } else if (newLeft > 0) {
                    left = 0;
                } else {
                    left = newLeft;
                }

                if (newTop < topLimit) {
                    top = topLimit;
                } else if (newTop > 0) {
                    top = 0;
                } else {
                    top = newTop;
                }

                applyStyles();
            }
        });

        controls.addEventListener('mousedown', function (event) {
            event.stopPropagation();
        });

        increaseControl.addEventListener('click', function () {
            scale += step;

            if (scale === max) {
                disableIncreaseControl();
            } else if (scale === min + step) {
                enableMovement();
                enableDecreaseControl();
            }

            topLimit = getTopLimit();
            leftLimit = getLeftLimit();

            applyStyles();
        });

        decreaseControl.addEventListener('click', function () {
            scale -= step;

            if (scale === min) {
                disableMovement();
                disableDecreaseControl();
            } else if (scale === max - step) {
                enableIncreaseControl();
            }

            topLimit = getTopLimit();
            leftLimit = getLeftLimit();

            if (left < leftLimit) {
                left = leftLimit;
            }

            if (top < topLimit) {
                top = topLimit;
            }

            applyStyles();
        });

        function getLeftLimit() {
            return (((wrapper.offsetWidth / 100) * scale) - wrapper.offsetWidth) * -1
        }

        function getTopLimit() {
            return (((wrapper.offsetHeight / 100) * scale) - wrapper.offsetHeight) * -1;
        }

        function enableMovement() {
            movable = true;
            wrapper.classList.add('cursor-grab');
        }

        function disableMovement() {
            movable = false;
            wrapper.classList.remove('cursor-grab');
        }

        function enableIncreaseControl() {
            increaseControl.disabled = false;
        }

        function disableIncreaseControl() {
            increaseControl.disabled = true;
        }

        function enableDecreaseControl() {
            decreaseControl.disabled = false;
        }

        function disableDecreaseControl() {
            decreaseControl.disabled = true;
        }

        function startMovement() {
            if (movable) {
                moving = true;
                wrapper.classList.add('cursor-grabbing');
                wrapper.classList.add('disable-movement-transition');
            }
        }

        function stopMovement() {
            if (movable) {
                moving = false;
                wrapper.classList.remove('cursor-grabbing');
                wrapper.classList.remove('disable-movement-transition');
            }
        }

        function applyStyles() {
            image.style.width = scale + '%';
            image.style.left = left + 'px';
            image.style.top = top + 'px';
        }
    });
})();