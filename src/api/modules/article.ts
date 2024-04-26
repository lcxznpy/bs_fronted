import { Article } from "@/api/interface/index";
import { ArticlePort } from "@/api/config/servicePort";
// import qs from "qs";

import http from "@/api";

/**
 * @name 获取面试记录列表模块
 */
// * 获取面试记录列表接口
export const ArticleListApi = () => {
	return http.get<Article.ArticleListResp>(ArticlePort + `/list_all`);
};

export const ArticleListUserApi = () => {
	return http.get<Article.ArticleListResp>(ArticlePort + `/list_user`);
};

export const CreateArticleApi = (params: Article.CreateArticleReq) => {
	return http.post<Article.CreateArticleResp>(ArticlePort + `/publish`, params, {
		headers: { "Content-Type": "application/json" }
	});
};

export const DeleteArticleApi = (params: Article.DeleteArticleReq) => {
	return http.delete<Article.DeleteArticleResp>(ArticlePort + `/delete`, params, {
		headers: { "Content-Type": "application/json" }
	});
};
