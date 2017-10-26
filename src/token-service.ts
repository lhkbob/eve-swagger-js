export interface TokenService {
  getTokenFor(characterID:number) :Promise<string>;
}