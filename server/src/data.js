const data = [
  {
    id: 1,
    name: 'react',
    description: 'Library for building user interfaces',
    features: ['JSX', 'Single Page Application', 'One-way data binding', 'Virtual DOM', 'Lifecycle Hooks'],
    libraries: [
      {
        id: 1,
        name: 'react-redux',
        description: 'State Management',
        alternatives: ['flux', 'mobx']
      },
      {
        id: 2,
        name: 'create-react-app',
        description: 'Command line for building react apps'
      },
      {
        id: 3,
        name: 'react-router',
        description: 'routing for react'
      }
    ]
  },
  {
    id: 2,
    name: 'angular',
    description: 'full stack web application framework',
    features: ['single page aplication', 'two-way databinding', 'typescript', 'dynamic loading'],
    libraries: [
      {
        id: 1,
        name: 'ngrx',
        description: 'state management library'
      },
      {
        id: 2,
        name: 'rxjs',
        description: 'Reactive programming with observables'
      }
    ]
  },
  {
    id: 3,
    name: 'vue',
    description: 'Framework for building user interfaces',
    features: ['components', 'routing', 'reactivity']
  }
];

module.exports = data;
