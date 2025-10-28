export default function (plop) {
  // Component generator
  plop.setGenerator('component', {
    description: 'Create a new shared UI component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Component name (PascalCase):',
      },
      {
        type: 'confirm',
        name: 'withStories',
        message: 'Create Storybook stories?',
        default: true,
      },
    ],
    actions: (data) => {
      const actions = [
        {
          type: 'add',
          path: 'src/shared/ui/{{pascalCase name}}.tsx',
          templateFile: 'plop-templates/component/component.tsx.hbs',
        },
      ]

      if (data.withStories) {
        actions.push({
          type: 'add',
          path: 'src/shared/ui/{{pascalCase name}}.stories.tsx',
          templateFile: 'plop-templates/component/stories.tsx.hbs',
        })
      }

      actions.push({
        type: 'append',
        path: 'src/shared/ui/index.ts',
        pattern: /(\/\/ PLOP_INJECT_EXPORT|$)/g,
        template:
          "export { {{pascalCase name}}, type {{pascalCase name}}Props } from './{{pascalCase name}}'",
      })

      return actions
    },
  })

  // Entity generator
  plop.setGenerator('entity', {
    description: 'Create a new entity with API hooks',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Entity name (singular, camelCase):',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/entities/{{camelCase name}}/types.ts',
        templateFile: 'plop-templates/entity/types.ts.hbs',
      },
      {
        type: 'add',
        path: 'src/entities/{{camelCase name}}/api/keys.ts',
        templateFile: 'plop-templates/entity/keys.ts.hbs',
      },
      {
        type: 'add',
        path: 'src/entities/{{camelCase name}}/api/queries.ts',
        templateFile: 'plop-templates/entity/queries.ts.hbs',
      },
      {
        type: 'add',
        path: 'src/entities/{{camelCase name}}/api/mutations.ts',
        templateFile: 'plop-templates/entity/mutations.ts.hbs',
      },
      {
        type: 'add',
        path: 'src/entities/{{camelCase name}}/api/index.ts',
        template: "export * from './keys'\nexport * from './queries'\nexport * from './mutations'",
      },
      {
        type: 'add',
        path: 'src/entities/{{camelCase name}}/index.ts',
        template: "export * from './types'\nexport * from './api'",
      },
    ],
  })

  // Route generator
  plop.setGenerator('route', {
    description: 'Create a new route',
    prompts: [
      {
        type: 'input',
        name: 'path',
        message: 'Route path (e.g., "_authenticated/settings"):',
      },
      {
        type: 'input',
        name: 'componentName',
        message: 'Component name (PascalCase):',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/routes/{{path}}.tsx',
        templateFile: 'plop-templates/route/route.tsx.hbs',
      },
    ],
  })
}
