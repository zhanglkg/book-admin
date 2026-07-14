# ---- 构建阶段 ----
FROM maven:3.9-eclipse-temurin-17 AS build
# 2G 小内存机器限制 Maven 堆，避免构建时 OOM 被 kill
ENV MAVEN_OPTS="-Xmx1024m"
WORKDIR /app
COPY pom.xml .
COPY src ./src
# 跳过测试打包可执行 jar（首次构建会下载依赖，稍慢但一次到位）
RUN mvn -B -e clean package -DskipTests

# ---- 运行阶段 ----
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
