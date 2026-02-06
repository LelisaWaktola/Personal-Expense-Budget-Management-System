package com.expense.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Personal Expense & Budget Management API")
                .version("1.0.0")
                .description("Backend API for tracking expenses and managing budgets"))
            .addSecurityItem(new SecurityRequirement().addList("Bearer Token"))
            .getComponents()
            .addSecuritySchemes("Bearer Token",
                new SecurityScheme()
                    .type(SecurityScheme.Type.HTTP)
                    .scheme("bearer")
                    .bearerFormat("JWT")
                    .description("JWT token for API authentication"))
            .getOpenAPI();
    }
}
