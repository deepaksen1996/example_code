""" upload custom model to google product/platform vertetx ai"""
import logging
from google.cloud import aiplatform


class VertexAiModelUpload:
    """
    upload custom model to vertetx ai
    """

    def __init__(self, project_name: str) -> None:
        self.project_name = project_name

    def __str__(self):
        return self.__class__.__name__

    def upload_to_vertetxai(
        self,
        model_name: str,
        model_gcs_path: str,
        image_uri: str,
        location_name: str = "us-central1",
    ) -> None:
        """
        Importing model to VertexAi Model Registry
        Args:
            model_name: Display Model name
            model_gcs_path: path of saved model
            image_uri: container Image uri
            location_name: region of model
        Returns:
        """
        try:
            aiplatform.Model.upload(
                display_name=model_name,
                artifact_uri=model_gcs_path,
                serving_container_image_uri=image_uri,
                project=self.project_name,
                location=location_name,
            )
        except Exception:
            raise
