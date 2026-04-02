export interface Exercise {
  id: string;
  name: string;
  image: string;
  instructions?: string[];
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export const EXERCISES: Record<string, Exercise[]> = {
  Chest: [
    {
      id: '1',
      name: 'Barbell Chest Press',
      image: 'https://image.tuasaude.com/media/article/rh/ho/chest-workout_44358.gif?width=1372&height=974',
      instructions: [
        'Lie on a flat bench with your feet flat on the floor.',
        'Grip the barbell with hands slightly wider than shoulder-width.',
        'Lower the bar slowly to your chest, keeping elbows at a 45-degree angle.',
        'Push the bar back up explosively while exhaling.',
        'Repeat for the desired number of repetitions.'
      ]
    },
    {
      id: '2',
      name: 'Inclined Chest Press with Dumbbells',
      image: 'https://image.tuasaude.com/media/article/xa/te/chest-workout_44360.gif?width=1372&height=974',
      instructions: [
        'Adjust the bench to a 30-45 degree incline.',
        'Sit on the bench and rest the dumbbells on your thighs.',
        'Lay back and lift the dumbbells above your chest.',
        'Lower the dumbbells slowly to the sides of your chest.',
        'Push them back up while exhaling until arms are extended.'
      ]
    },

    {
      id: '3',
      name: 'Cable Cross-Over',
      image: 'https://image.tuasaude.com/media/article/xz/ku/chest-workout_44357.gif?width=1372&height=974',
      instructions: [
        'Stand in the middle of a cable machine with pulleys set high.',
        'Grasp the handles and step forward with one foot for stability.',
        'Lean forward slightly and pull the handles together in front of your chest.',
        'Keep a slight bend in your elbows and squeeze your chest at the midpoint.',
        'Control the return movement to the starting position.'
      ]
    },

    {
      id: '16',
      name: 'Dips on Parallel Bars',
      image: 'https://image.tuasaude.com/media/article/ds/pf/chest-workout_44361.gif?width=1372&height=974',
      instructions: [
        'Grasp the bars with hands slightly wider than shoulder-width.',
        'Hinge your hips forward so that your chest is angled downwards.',
        'Lower yourself slowly while keeping your elbows slightly flared.',
        'Push yourself back up until your arms are fully extended.',
        'Breathe out as you push and in as you lower.'
      ]
    },
    {
      id: '17',
      name: 'Push-ups',
      image: 'https://image.tuasaude.com/media/article/dw/pt/chest-workout_44359.gif?width=1372&height=974',
      instructions: [
        'Place your hands on the floor slightly wider than shoulder-width.',
        'Keep your body in a straight line from head to heels.',
        'Lower your chest towards the floor until elbows are at a 90-degree angle.',
        'Push yourself back up to the starting position while exhaling.',
        'Avoid letting your hips sag or hike up.'
      ]
    },

  ],
  Back: [
    {
      id: '4',
      name: 'Pull-ups',
      image: 'https://image.tuasaude.com/media/article/jt/eo/back-workout_44706.gif?width=1372&height=974',
      instructions: [
        'Grasp the pull-up bar with an overhand grip, slightly wider than shoulder-width.',
        'Pull yourself up until your chin is above the bar, leading with your chest.',
        'Squeeze your lats and shoulder blades together at the top.',
        'Lower yourself slowly with control back to the starting position.',
        'Breathe out as you pull up and in as you lower.'
      ]
    },
    { 
      id: '5', 
      name: 'Bent-Over Rows with Barbell', 
      image: 'https://image.tuasaude.com/media/article/hv/ut/back-workout_44332.gif?width=1372&height=974',
      instructions: [
        'Stand with feet hip-width apart and bend your knees slightly.',
        'Hinge at the hips so your torso is almost parallel to the floor.',
        'Grasp the barbell and pull it towards your lower ribcage.',
        'Squeeze your back muscles at the peak of the movement.',
        'Lower the bar slowly with control to the starting position.'
      ]
    },
    {
      id: '6',
      name: 'Deadlift',
      image: 'https://image.tuasaude.com/media/article/cc/uj/leg-workout_44348.gif?width=1372&height=974',
      instructions: [
        'Stand with feet hip-width apart and the bar over your mid-foot.',
        'Bend at the hips and knees to grasp the bar with a flat back.',
        'Engage your core and lift the bar by extending your hips and knees.',
        'Keep the bar close to your body throughout the entire movement.',
        'Hinge at the hips to lower the bar back to the floor with control.'
      ]
    },
    {
      id: '25',
      name: 'Cable Lat Pull Down',
      image: 'https://image.tuasaude.com/media/article/wr/ov/back-workout_44329.gif?width=1372&height=974',
      instructions: [
        'Sit on the machine and secure your knees under the pads.',
        'Grip the bar with your hands wider than shoulder-width.',
        'Pull the bar down towards your upper chest while leaning back slightly.',
        'Focus on pulling with your elbows and squeezing your lats.',
        'Slowly return the bar to the starting position with control.'
      ]
    },
    {
      id: '26',
      name: 'High Row Machine',
      image: 'https://image.tuasaude.com/media/article/us/io/back-workout_44335.gif?width=1372&height=974',
      instructions: [
        'Sit on the machine and press your chest against the pad.',
        'Grasp the handles and pull them down towards your sides.',
        'Squeeze your shoulder blades together at the bottom.',
        'Slowly return the handles back to the starting position.',
        'Exhale as you pull and inhale as you release.'
      ]
    },
    {
      id: '27',
      name: 'Landmine Row',
      image: 'https://image.tuasaude.com/media/article/xr/oi/back-workout_44327.gif?width=1372&height=974',
      instructions: [
        'Stand over the barbell and hinge at your hips.',
        'Grasp the handle or the barbell with both hands.',
        'Pull the barbell towards your chest while keeping your elbows close.',
        'Squeeze your back muscles at the peak of the movement.',
        'Lower the barbell slowly with control to the starting position.'
      ]
    },
    {
      id: '28',
      name: 'Upright Barbell Row',
      image: 'https://image.tuasaude.com/media/article/dm/ze/back-workout_44336.gif?width=1372&height=974',
      instructions: [
        'Stand with feet shoulder-width apart and hold a barbell with an overhand grip.',
        'Pull the barbell up towards your chin, keeping it close to your body.',
        'Lead with your elbows and ensure they stay higher than your wrists.',
        'Squeeze your traps and upper back at the peak of the movement.',
        'Lower the barbell slowly back to the starting position.'
      ]
    },
    {
      id: '29',
      name: 'One Arm Dumbbell Row',
      image: 'https://image.tuasaude.com/media/article/gl/qn/back-workout_44333.gif?width=1372&height=974',
      instructions: [
        'Place one hand and knee on a bench and hold a dumbbell in the other hand.',
        'Pull the dumbbell up towards your hip, keeping your elbow close to your body.',
        'Squeeze your back muscles at the peak of the movement.',
        'Lower the dumbbell slowly with control to the starting position.',
        'Avoid twisting your torso while Row.'
      ]
    },
    {
      id: '30',
      name: 'Cable Pullover',
      image: 'https://image.tuasaude.com/media/article/ay/va/back-workout_44337.gif?width=1372&height=974',
      instructions: [
        'Stand in front of a cable machine with a straight bar attached high.',
        'Grasp the bar with an overhand grip and lean forward slightly.',
        'Pull the bar down towards your thighs while keeping your arms straight.',
        'Focus on squeezing your lats at the bottom of the movement.',
        'Slowly return the bar to the starting position with control.'
      ]
    },
    {
      id: '31',
      name: 'Lever Seated Reverse Fly',
      image: 'https://image.tuasaude.com/media/article/kr/ph/back-workout_44338.gif?width=1372&height=974',
      instructions: [
        'Sit on the machine with your chest against the pad.',
        'Grasp the handles and pull them out to the sides.',
        'Squeeze your rear delts and upper back at the peak of the movement.',
        'Slowly return the handles back to the starting position.',
        'Avoid leading with your hands; pull with your elbows.'
      ]
    },
    {
      id: '32',
      name: 'Assisted Pull Ups',
      image: 'https://image.tuasaude.com/media/article/xt/gz/back-workout_44707.gif?width=1372&height=974',
      instructions: [
        'Kneel or stand on the machine platform and grasp the handles.',
        'Pull yourself up until your chin is above the handles.',
        'Squeeze your lats and shoulder blades together at the top.',
        'Lower yourself slowly with control back to the starting position.',
        'Maintain a steady pace and avoid using momentum.'
      ]
    },
    {
      id: '33',
      name: 'Seated Cable Row',
      image: 'https://image.tuasaude.com/media/article/yt/ve/back-workout_44330.gif?width=1372&height=974',
      instructions: [
        'Sit at the machine with feet on the pads and knees slightly bent.',
        'Grasp the handle and pull it towards your abdomen while leaning back slightly.',
        'Squeeze your shoulder blades together at the peak of the movement.',
        'Slowly return the handle back to the starting position with control.',
        'Breathe out as you pull and in as you release.'
      ]
    },
    {
      id: '34',
      name: 'Plank',
      image: 'https://image.tuasaude.com/media/article/vw/ij/back-workout_44708.gif?width=1372&height=974',
      instructions: [
        'Place your forearms on the floor with elbows directly under your shoulders.',
        'Extend your legs back and keep your body in a straight line from head to heels.',
        'Engage your core and squeeze your glutes to maintain stability.',
        'Stay in this position for the desired duration.',
        'Avoid letting your hips sag or hike up.'
      ]
    },
  ],









  Legs: [
    {
      id: '7',
      name: 'Squat',
      image: 'https://image.tuasaude.com/media/article/nd/nb/leg-workout_44353.gif?width=1372&height=974',
      instructions: [
        'Stand with feet shoulder-width apart and your toes pointed slightly outwards.',
        'Lower your hips back and down like you’re sitting into an imaginary chair.',
        'Keep your chest high and gaze forward. Your weight should be in your heels.',
        'Push your knees slightly out and lower until your thighs are parallel to the floor.',
        'Drive through your heels to explode back up to the starting position while exhaling.'
      ]
    },

    {
      id: '8',
      name: 'Leg Press',
      image: 'https://image.tuasaude.com/media/article/hp/po/leg-workout_44347.gif?width=1372&height=974',
      instructions: [
        'Place your feet shoulder-width apart on the platform.',
        'Lower the platform slowly by bending your knees to a 90-degree angle.',
        'Push the platform back up using your heels, avoiding full knee lockout.',
        'Keep your head and back flat against the seat throughout.',
        'Breathe out as you push and in as you lower.'
      ]
    },

    {
      id: '9',
      name: 'Lunges',
      image: 'https://image.tuasaude.com/media/article/hm/as/leg-workout_44354.gif?width=1372&height=974',
      instructions: [
        'Stand tall with your feet hip-width apart and take a big step forward.',
        'Lower your hips until both knees are bent at a 90-degree angle.',
        'Keep your front knee directly above your ankle and avoid letting it cave in.',
        'Push off your front foot to return to the starting position.',
        'Keep your torso upright and core engaged throughout.'
      ]
    },

    {
      id: '19',
      name: 'Leg Extensions',
      image: 'https://image.tuasaude.com/media/article/ov/yi/leg-workout_44346.gif?width=1372&height=974',
      instructions: [
        'Sit on the machine and hook your feet under the padded bar.',
        'Adjust the seat so your knees align with the machine pivot.',
        'Extend your legs fully while exhaling, squeezing your quads at the top.',
        'Lower the weight slowly to the starting position.',
        'Keep your back flat against the seat throughout the set.'
      ]
    },
    {

      id: '20',
      name: 'Leg Curls',
      image: 'https://image.tuasaude.com/media/article/ud/em/leg-workout_44344.gif?width=1372&height=974',
      instructions: [
        'Lie face down on the machine or sit as per the machine type.',
        'Hook your heels under the padded bar and grasp the handles.',
        'Curl your legs as far as possible towards your glutes while exhaling.',
        'Squeeze your hamstrings at the peak contraction.',
        'Lower the weight slowly to the starting position.'
      ]
    },
    {
      id: '21',
      name: 'Adduction Machine',
      image: 'https://image.tuasaude.com/media/article/kn/ii/leg-workout_44342.gif?width=1372&height=974',
      instructions: [
        'Sit on the machine with your legs spread apart against the pads.',
        'Choose a comfortable weight and grasp the side handles.',
        'Squeeze your legs together slowly while exhaling.',
        'Hold the peak contraction for a second.',
        'Return to the starting position with a controlled movement.'
      ]
    },
    {
      id: '22',
      name: 'Sumo Squat',
      image: 'https://image.tuasaude.com/media/article/hp/ny/leg-workout_44350.gif?width=1372&height=974',
      instructions: [
        'Stand with your feet wider than shoulder-width and toes pointed outwards.',
        'Lower your hips towards the floor by bending your knees.',
        'Keep your back straight and chest up throughout the movement.',
        'Push yourself back up to the starting position using your heels.',
        'Exhale as you push and inhale as you lower.'
      ]
    },
    {
      id: '23',
      name: 'Bulgarian Split Squat',
      image: 'https://image.tuasaude.com/media/article/mv/yr/leg-workout_44352.gif?width=1372&height=974',
      instructions: [
        'Stand a few feet in front of a bench and place one foot behind you on it.',
        'Lower your hips until your front thigh is parallel to the ground.',
        'Keep your chest upright and core tight for balance.',
        'Push off your front heel to return to the starting position.',
        'Focus on deep, controlled range of motion.'
      ]
    },
    {
      id: '24',
      name: 'Calf Raises',
      image: 'https://image.tuasaude.com/media/article/dm/hs/leg-workout_44356.gif?width=1372&height=974',
      instructions: [
        'Stand with the balls of your feet on a raised platform or floor.',
        'Slowly rise up on your toes as high as possible.',
        'Squeeze your calf muscles at the peak of the contraction.',
        'Lower your heels back down in a controlled manner.',
        'Maintain a slight bend in your knees for balance.'
      ]
    },
  ],






  Shoulders: [
    { id: '10', name: 'Overhead Press', image: 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=400' },
    { id: '11', name: 'Lateral Raises', image: 'https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?w=400' },
    { id: '12', name: 'Front Raises', image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400' },
  ],
  Arms: [
    { id: '13', name: 'Bicep Curls', image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400' },
    { id: '14', name: 'Tricep Pushdowns', image: 'https://images.unsplash.com/photo-1590239062391-7f37c3a64966?w=400' },
    { id: '15', name: 'Hammer Curls', image: 'https://images.unsplash.com/photo-1591948971339-c05f7004dca0?w=400' },
  ],
};

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Chest', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400' },
  { id: '2', name: 'Back', image: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400' },
  { id: '3', name: 'Legs', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400' },
  { id: '4', name: 'Shoulders', image: 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=400' },
  { id: '5', name: 'Arms', image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400' },
];
