import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

const Stars = ({ count }) => {
  const particlesInit = async (main) => {
    await loadFull(main);
  };
  return (
    <div className='fixed top-0 left-0 w-screen h-screen -z-20'>
      <Particles
        id='tsparticles'
        init={particlesInit}
        options={{
          background: {
            color: {
              value: '',
            },
          },
          fpsLimit: 60,
          particles: {
            number: {
              value: count,
              density: {
                enable: true,
                value_area: 789.1476416322727,
              },
            },
            color: {
              value: '#ffffff',
            },
            shape: {
              type: 'circle',
              stroke: {
                width: 0,
                color: '#000000',
              },
              polygon: {
                nb_sides: 5,
              },
              image: {
                src: 'img/github.svg',
                width: 100,
                height: 100,
              },
            },
            opacity: {
              value: 0.48927153781200905,
              random: false,
              anim: {
                enable: true,
                speed: 0.2,
                opacity_min: 0,
                sync: false,
              },
            },
            size: {
              value: 2,
              random: true,
              anim: {
                enable: true,
                speed: 2,
                size_min: 0,
                sync: false,
              },
            },
            links: {
              enable: false,
            },
            collisions: {
              enable: false,
            },
            move: {
              enable: true,
              speed: 0.2,
              direction: 'none',
              random: true,
              straight: false,
              out_mode: 'out',
              bounce: false,
              attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200,
              },
            },
          },
          interactivity: {
            events: {
              onClick: {
                enable: false,
                mode: 'push',
              },
              onHover: {
                enable: false,
                mode: 'repulse',
              },
              resize: true,
            },
            modes: {
              bubble: {
                distance: 400,
                duration: 2,
                opacity: 0.8,
                size: 40,
              },
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 200,
                duration: 0.4,
              },
            },
          },
          detectRetina: true,
        }}
      />
    </div>
  );
};

export default Stars;
