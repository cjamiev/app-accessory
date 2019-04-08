export class Generator {
  category: string;
  groups: Group[];
}

export class Group {
  type: string;
  files: string[];
  handlebars: string[]; 
}