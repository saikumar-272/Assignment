import { AuthenticationService } from "../services/authentication.service";

export function initializeSessionFactory(
  authService: AuthenticationService
): () => Promise<void> {
  return () => authService.initSessionFromLocalStorage();
}
