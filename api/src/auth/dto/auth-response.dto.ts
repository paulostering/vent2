export class AuthResponseDto {
  user: {
    id: string;
    email: string;
    type: 'employee' | 'customer';
    role: string;
    tenantId: string;
  };
  message: string;
}

